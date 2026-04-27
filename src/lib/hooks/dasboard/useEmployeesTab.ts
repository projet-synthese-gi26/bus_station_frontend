import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormType, employeeFormSchema } from "@/lib/types/schema/employeeSchema";
import { getEmployeesByAgency, createEmployeeForAgency, updateEmployee } from "@/lib/services/employe-service";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { useBusStation } from "@/context/Provider";
import {EmployeRequestDTO, EmployeResponseDTO} from "@/lib/types/generated-api";
import {deleteVehicle} from "@/lib/services/vehicule-service";


export function useEmployeesTab() {


    const { userData, isLoading: isUserLoading } = useBusStation();
    const [employees, setEmployees] = useState<EmployeResponseDTO[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<EmployeResponseDTO | null>(null);


    const form = useForm<EmployeeFormType>({resolver: zodResolver(employeeFormSchema),});

    const [canOpenConfirmationModal, setCanOpenConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeResponseDTO | null>(null);



    const fetchEmployees = useCallback(async (id: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const data = await getEmployeesByAgency(id) as unknown as EmployeResponseDTO[];
            setEmployees(data || []);
        } catch (error) {
            console.error(error);
            setApiError("Impossible de charger la liste des employés.");
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
                    await fetchEmployees(agency.agencyId);
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
    }, [userData, isUserLoading, fetchEmployees]);



    function openModalForCreate(): void  {
        setEditingEmployee(null);
        form.reset({ password: '', confirmPassword: '' });
        setApiError(null);
        setIsModalOpen(true);
    }

    function openModalForEdit (employee: EmployeResponseDTO):void  {
        setEditingEmployee(employee);
        form.reset({
            first_name: employee.firstName,
            last_name: employee.lastName,
            username: employee.username,
            email: employee.email,
            phone_number: employee.phoneNumber,
            poste: employee.poste,
            departement: employee.departement,
            password: '',
            confirmPassword: ''
        });
        setApiError(null);
        setIsModalOpen(true);
    }

    function closeModal (){
        setIsModalOpen(false);
        setEditingEmployee(null);
    }

    async function onSubmit (data: EmployeeFormType): Promise<void>{
        if (!agencyId) {
            setApiError("ID de l'agence introuvable.");
            return;
        }
        setIsSubmitting(true);
        setApiError(null);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...baseData } = data;
        const payload: EmployeRequestDTO = {
            ...baseData,
            role: ["EMPLOYE"],
            agenceVoyageId: agencyId,
            userExist: !!editingEmployee
        }

        try {
            if (editingEmployee && editingEmployee.employeId) {
                await updateEmployee(editingEmployee.employeId, payload);
            } else {
                await createEmployeeForAgency(payload);
            }
            await fetchEmployees(agencyId);
            closeModal();
        } catch (error) {
            console.error(error);
            setApiError("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    }





    function openConfirmModal(employee: EmployeResponseDTO)
    {
        if (employee && employee.userId) {
            setConfirmationMessage(`Etes vous sur de vouloir supprimer le véhicule ${employee.firstName} - ${employee.lastName} ?`);
            setEmployeeToDelete(employee)
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
        if (!employeeToDelete || !employeeToDelete.employeId) return;
        await deleteVehicle(employeeToDelete.employeId)
            .then(()=> {
                setEmployees(prev => prev.filter(v => v.employeId !== employeeToDelete.employeId));})
            .catch(()=>  setApiError("Erreur lors de la suppression, veuillez reessayer plutard"))
            .finally(()=> setIsLoading(false));

    }


    return {
        employees,
        isLoading,
        isSubmitting,
        isModalOpen,
        apiError,
        form,
        editingEmployee,
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