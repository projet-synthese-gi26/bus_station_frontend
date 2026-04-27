import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleFormType, vehicleFormSchema } from "@/lib/types/schema/vehicleSchema";
import { getVehiclesByAgency, createVehicleForAgency, updateVehicle, deleteVehicle } from "@/lib/services/vehicule-service";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { useBusStation } from "@/context/Provider";
import { Vehicule, VehiculeDTO } from "@/lib/types/generated-api";

export function useVehiclesTab() {
  const { userData, isLoading: isUserLoading } = useBusStation();


  const [vehicles, setVehicles] = useState<Vehicule[]>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);


  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [canOpenConfirmationModal, setCanOpenConfirmationModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string|null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");


  const [editingVehicle, setEditingVehicle] = useState<Vehicule | null>(null);

  const form = useForm<VehicleFormType>({
    resolver: zodResolver(vehicleFormSchema),
  });

  const fetchVehicles = useCallback(async (id: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await getVehiclesByAgency(id);
      setVehicles(response || []);
    } catch (error) {
      console.error(error);
      setApiError("Impossible de charger la liste des véhicules.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (isUserLoading || !userData?.userId) return;
      try {
        const agency = await getAgencyByChefId(userData.userId);
        if (agency?.agencyId) {
          setAgencyId(agency.agencyId);
          await fetchVehicles(agency.agencyId);
        } else {
          setApiError("Aucune agence n'est associée à votre compte.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setApiError("Erreur de récupération de votre agence.");
        setIsLoading(false);
      }
    };
    initialize();
  }, [userData, isUserLoading, fetchVehicles]);

  function openModalForCreate ()  {
    setEditingVehicle(null);
    form.reset();
    setApiError(null);
    setIsModalOpen(true);
  }

  function openModalForEdit (vehicle: Vehicule)  {
    setEditingVehicle(vehicle);
    form.reset({
      nom: vehicle.nom,
      modele: vehicle.modele,
      plaqueMatricule: vehicle.plaqueMatricule,
      nbrPlaces: vehicle.nbrPlaces,
      description: vehicle.description || '',
      lienPhoto: vehicle.lienPhoto || ''
    });
    setApiError(null);
    setIsModalOpen(true);
  }

  function closeModal  () {
    setIsModalOpen(false);
    setEditingVehicle(null);
  }

  async function onSubmit  (data: VehicleFormType)  {
    if (!agencyId) {
      setApiError("ID de l'agence introuvable.");
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    const payload: VehiculeDTO = { ...data, idAgenceVoyage: agencyId };

    try
    {
      if (editingVehicle && editingVehicle.idVehicule)
      {
        await updateVehicle(editingVehicle.idVehicule, payload);
      }
      else
      {
        await createVehicleForAgency(payload);
      }
      await fetchVehicles(agencyId);
      closeModal();
    } catch (error) {
      console.error(error);
      setApiError( "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }



  function openConfirmModal(vehicle: Vehicule)
  {
    if (vehicle && vehicle.idVehicule) {
      setConfirmationMessage(`Etes vous sur de vouloir supprimer le véhicule ${vehicle.nom} - ${vehicle.modele} ?`);
      setVehicleToDelete(vehicle.idVehicule)
      setCanOpenConfirmationModal(true);
    }
    else
    {
      setConfirmationMessage("");
      setApiError("Une erreur est survenue, veuillez reessayer plutard");
    }

  }

  async function handleDelete (){
    setIsLoading(true);
    setApiError(null);
    if (!vehicleToDelete) return;
    await deleteVehicle(vehicleToDelete)
        .then(()=> {
          setVehicles(prev => prev.filter(v => v.idVehicule !== vehicleToDelete));})
        .catch(()=>  setApiError("Erreur lors de la suppression, veuillez reessayer plutard"))
        .finally(()=> setIsLoading(false));

  }

  return {
    vehicles,
    isLoading,
    isSubmitting,
    isModalOpen,
    apiError,
    form,
    editingVehicle,
    openModalForCreate,
    openModalForEdit,
    closeModal,
    onSubmit,
    handleDelete,
    canOpenConfirmationModal,
    setCanOpenConfirmationModal,
    openConfirmModal,
    confirmationMessage,
  };
}