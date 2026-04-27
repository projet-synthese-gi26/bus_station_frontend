import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DriverFormType, driverFormSchema } from "@/lib/types/schema/driverSchema";
import { getDriversByAgency, createDriverForAgency, updateDriver, deleteDriver } from "@/lib/services/chauffeur-service";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { useBusStation } from "@/context/Provider";
import { UserResponseCreatedDTO, ChauffeurRequestDTO } from "@/lib/types/generated-api";
import {Customer} from "@/lib/types/models/BusinessActor";

export function useDriversTab() {
  const { userData, isLoading: isUserLoading } = useBusStation();

  // États de données
  const [drivers, setDrivers] = useState<Customer[]>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  // États UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // NOUVEAU : État pour gérer le mode (création ou édition)
  const [editingDriver, setEditingDriver] = useState<UserResponseCreatedDTO | null>(null);

  const form = useForm<DriverFormType>({
    resolver: zodResolver(driverFormSchema),
  });

  const fetchDrivers = useCallback(async (id: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await getDriversByAgency(id);
      console.log(data);
      if (data) setDrivers(data || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setApiError("Impossible de charger la liste des chauffeurs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // ... (la logique d'initialisation reste la même) ...
    const initialize = async () => {
      if (isUserLoading || !userData?.userId) return;
      try {
        const agency = await getAgencyByChefId(userData.userId);
        if (agency?.agencyId) {
          setAgencyId(agency.agencyId);
          await fetchDrivers(agency.agencyId);
        } else {
          setApiError("Aucune agence n'est associée à votre compte.");
          setIsLoading(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setApiError("Erreur de récupération de votre agence.");
        setIsLoading(false);
      }
    };
    initialize();
  }, [userData, isUserLoading, fetchDrivers]);

  const openModalForCreate = () => {
    setEditingDriver(null);
    form.reset({ password: '', });
    setApiError(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (driver: UserResponseCreatedDTO) => {
    setEditingDriver(driver);
    form.reset({
      first_name: driver.first_name,
      last_name: driver.last_name,
      username: driver.username,
      email: driver.email,
      phone_number: driver.phone_number,
      gender: driver.gender,
      password: '', // On ne pré-remplit pas le mot de passe pour la sécurité
    });
    setApiError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const onSubmit = async (data: DriverFormType) => {
    if (!agencyId) {
      setApiError("ID de l'agence introuvable.");
      return;
    }
    setIsSubmitting(true);
    setApiError(null);


    const payload: ChauffeurRequestDTO = {
      ...data,
      role: ["USAGER"],
      agenceVoyageId: agencyId,
      userExist: !!editingDriver // true en mode édition, false en création
    };


    try {
      if (editingDriver && editingDriver.id) {
        await updateDriver(editingDriver.id, payload);
      } else {
        await createDriverForAgency(payload);
      }
      await fetchDrivers(agencyId);
      closeModal();
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const [canOpenConfirmModal, setCanOpenConfirmModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Customer | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");

  function openConfirmModal(driver: Customer) {
    if(!driver) {
      setApiError("Something went wrong went attempting to delete this driver");
      return;
    }
    setDriverToDelete(driver);
    setConfirmationMessage(`Are you sure you want to delete the driver ${driver.first_name} ${driver.last_name} ?`);
    setCanOpenConfirmModal(true);
  }


  const handleDelete = async () => {
    if (!driverToDelete) return;
    setIsLoading(true);
    setApiError(null);
    await deleteDriver(driverToDelete.userId)
        .then(()=> {
          setDrivers(prev => prev.filter(d => d.userId !== driverToDelete?.userId));
        })
        .catch(()=>  setApiError("Erreur lors de la suppression."))
        .finally(()=> setIsLoading(false))
  };


  return {
    drivers,
    isLoading,
    isSubmitting,
    isModalOpen,
    apiError,
    form,
    editingDriver,
    openModalForCreate,
    openModalForEdit,
    closeModal,
    onSubmit,
    handleDelete,
    openConfirmModal,
    canOpenConfirmModal,
    setCanOpenConfirmModal,
    confirmationMessage,
  };
}