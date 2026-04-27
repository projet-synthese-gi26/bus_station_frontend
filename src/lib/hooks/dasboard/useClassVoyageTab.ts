import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { ClassVoyage, ClassVoyageDTO } from "@/lib/types/generated-api";
import { ClassVoyageFormType, classVoyageSchema } from "@/lib/types/schema/classVoyageSchema";
import { getAllClassVoyagesByAgence, createClassVoyage, updateClassVoyage, deleteClassVoyage } from "@/lib/services/class-voyage-service";

export function useClassVoyageTab() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [classes, setClasses] = useState<ClassVoyage[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [editingClass, setEditingClass] = useState<ClassVoyage | null>(null);

    // États pour la modal de confirmation (comme EmployeesTab)
    const [canOpenConfirmationModal, setCanOpenConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [classToDelete, setClassToDelete] = useState<ClassVoyage | null>(null);

    const form = useForm<ClassVoyageFormType>({ resolver: zodResolver(classVoyageSchema) });

    const fetchAndFilterClasses = useCallback(async (currentAgencyId: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            console.log("id agence ",currentAgencyId);
            const response = await getAllClassVoyagesByAgence(currentAgencyId);
            const agencyClasses = response.filter(cls => cls.idAgenceVoyage === currentAgencyId);
            setClasses(agencyClasses);
        } catch (e) {
            console.error(e);
            setApiError("Impossible de charger les classes de voyage.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isUserLoading || !userData?.userId) return;

        getAgencyByChefId(userData.userId).then(agency => {
            if (agency?.agencyId) {
                setAgencyId(agency.agencyId);
                fetchAndFilterClasses(agency.agencyId);
            } else {
                setApiError("Agence non trouvée.");
                setIsLoading(false);
            }
        }).catch(() => {
            setApiError("Erreur de récupération de l'agence.");
            setIsLoading(false);
        });

    }, [userData, isUserLoading, fetchAndFilterClasses]);

    function openModalForCreate(): void {
        setEditingClass(null);
        form.reset({ nom: '', prix: 0, tauxAnnulation: 0 });
        setApiError(null);
        setIsModalOpen(true);
    }

    function openModalForEdit(cls: ClassVoyage): void {
        setEditingClass(cls);
        form.reset({
            nom: cls.nom,
            prix: cls.prix,
            tauxAnnulation: cls.tauxAnnulation,
        });
        setApiError(null);
        setIsModalOpen(true);
    }

    function closeModal(): void {
        setIsModalOpen(false);
        setEditingClass(null);
    }

    async function onSubmit(data: ClassVoyageFormType): Promise<void> {
        if (!agencyId) {
            setApiError("ID de l'agence introuvable.");
            return;
        }
        setIsSubmitting(true);
        setApiError(null);
        const payload: ClassVoyageDTO = { ...data, idAgenceVoyage: agencyId };

        try {
            if (editingClass?.idClassVoyage) {
                await updateClassVoyage(editingClass.idClassVoyage, payload);
            } else {
                await createClassVoyage(payload);
            }
            await fetchAndFilterClasses(agencyId);
            closeModal();
        } catch (e) {
            console.error(e);
            setApiError("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Fonction pour ouvrir la modal de confirmation (comme EmployeesTab)
    function openConfirmModal(classVoyage: ClassVoyage): void {
        if (classVoyage && classVoyage.idClassVoyage) {
            setConfirmationMessage(`Êtes-vous sûr de vouloir supprimer la classe "${classVoyage.nom}" ?`);
            setClassToDelete(classVoyage);
            setCanOpenConfirmationModal(true);
        } else {
            setConfirmationMessage("");
            setApiError("Une erreur est survenue, veuillez réessayer plus tard");
        }
    }

    // Fonction handleDelete modifiée (comme EmployeesTab)
    async function handleDelete(): Promise<void> {
        setIsLoading(true);
        setApiError(null);
        if (!classToDelete || !classToDelete.idClassVoyage) return;

        try {
            await deleteClassVoyage(classToDelete.idClassVoyage);
            setClasses(prev => prev.filter(c => c.idClassVoyage !== classToDelete.idClassVoyage));
            setCanOpenConfirmationModal(false);
        } catch (e ) {
            console.error(e);
            setApiError("Erreur lors de la suppression, veuillez réessayer plus tard");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        classes,
        isLoading,
        isSubmitting,
        isModalOpen,
        apiError,
        editingClass,
        form,
        openModalForCreate,
        openModalForEdit,
        closeModal,
        onSubmit,
        handleDelete,
        canOpenConfirmationModal,
        setCanOpenConfirmationModal,
        confirmationMessage,
        openConfirmModal
    };
}