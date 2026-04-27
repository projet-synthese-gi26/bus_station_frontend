"use client"
import { useTranslation } from "react-i18next"
import {
    Plus,
    Edit,
    Trash2,
    Users,
    AlertCircle,
    Search,
    Mail,
    Building2,
    User,
    Activity,
    Briefcase,
    Settings
} from "lucide-react"
import { useEmployeesTab } from "@/lib/hooks/dasboard/useEmployeesTab"
import AddEmployeeModal from "./AddEmployeeModal"
import Loader from "@/modals/Loader"
import { useState, useMemo } from "react"
import TransparentModal from "@/modals/TransparentModal"
import {ConfirmationModal} from "@/modals/ConfirmActionModal";

const EmployeesTab = () => {
    const { t } = useTranslation()
    const hook = useEmployeesTab()

    // État pour la recherche
    const [searchTerm, setSearchTerm] = useState("")

    // Filtrage des employés basé sur la recherche
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return hook.employees

        return hook.employees.filter((employee) =>
            employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.poste?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.departement?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [hook.employees, searchTerm])

    // Fonction pour obtenir le badge de poste
    const getPosteBadge = (poste: string) => {
        const badges = {
            "Responsable Commercial": { color: "bg-blue-100 text-blue-800", icon: "💼" },
            "Comptable": { color: "bg-green-100 text-green-800", icon: "📊" },
            "Receptionniste": { color: "bg-purple-100 text-purple-800", icon: "📞" },
            "Manager": { color: "bg-orange-100 text-orange-800", icon: "👔" },
            "Assistant": { color: "bg-gray-100 text-gray-800", icon: "📋" },
        }
        return badges[poste as keyof typeof badges] || { color: "bg-gray-100 text-gray-800", icon: "👤" }
    }

    // Fonction pour obtenir le statut coloré
    const getEmployeeStatus = (status: string) => {
        switch (status) {
            case 'ACTIF':
                return { color: "bg-green-100 text-green-800", label: "Actif", dot: "bg-green-400" }
            case 'INACTIF':
                return { color: "bg-red-100 text-red-800", label: "Inactif", dot: "bg-red-400" }
            case 'CONGE':
                return { color: "bg-orange-100 text-orange-800", label: "En congé", dot: "bg-orange-400" }
            default:
                return { color: "bg-green-100 text-green-800", label: "Actif", dot: "bg-green-400" }
        }
    }

    // Fonction pour obtenir les initiales
    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
    }

    // Fonction pour obtenir la couleur d'avatar
    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400",
            "bg-indigo-400", "bg-yellow-400", "bg-red-400", "bg-teal-400"
        ]
        const charCode = name.charCodeAt(0) || 0
        return colors[charCode % colors.length]
    }

    if (hook.isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader />
            </div>
        )
    }

    if (hook.apiError && !hook.isModalOpen) {
        return (
            <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{hook.apiError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        )
    }

    return (
        <div className="p-4">
            {/* Header avec recherche */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion des Employés</h3>
                        <p className="text-gray-600">Gérez votre équipe et les ressources humaines</p>
                    </div>
                    <button
                        onClick={hook.openModalForCreate}
                        className="cursor-pointer flex items-center gap-3 bg-primary text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5"/>
                        {t("dashboard.resources.addEmployee")}
                    </button>
                </div>

                {/* Barre de recherche */}
                <div className="relative max-w-md">
                    <Search
                        className="group-hover:stroke-2 group-hover:stroke-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl hover:border-2 hover:border-primary focus:outline-none outline-none focus:border-2 focus:border-primary ring-0  transition-colors"
                    />
                </div>

                {/* Indicateur de résultats */}
                {searchTerm && (
                    <p className="mt-3 text-sm text-gray-600">
                        {filteredEmployees.length} résultat(s) pour &#34;{searchTerm}&#34;
                    </p>
                )}
            </div>


            <TransparentModal  isOpen={hook.isModalOpen}>
                <AddEmployeeModal hook={hook}/>
            </TransparentModal>

            <TransparentModal  isOpen={hook.canOpenConfirmationModal}>
                <ConfirmationModal isOpen={true}
                    onClose={()=> hook.setCanOpenConfirmationModal(false)}
                    onConfirm={hook.handleDelete}
                    title={"Delete Employee"}
                    message={hook.confirmationMessage}
                />
            </TransparentModal>



            {/* Contenu principal */}
            {filteredEmployees.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <Users className="h-10 w-10 text-gray-400"/>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? "Aucun employé trouvé" : "Aucun employé dans votre équipe"}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        {searchTerm
                            ? "Essayez de modifier votre recherche"
                            : "Commencez par ajouter votre premier employé pour gérer votre équipe."
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={hook.openModalForCreate}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Ajouter un employé
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-blue-200">
                        <tr>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <User className="h-5 w-5 text-primary"/>
                                    Employé
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Mail className="h-5 w-5 text-primary"/>
                                    Contact
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary"/>
                                    Poste
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Activity className="h-5 w-5 text-primary"/>
                                    Statut
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Settings className="h-5 w-5 text-primary"/>
                                    Actions
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredEmployees.map((employee, index) => {
                            const status = getEmployeeStatus(employee.statutEmploye || 'ACTIF')
                            const posteBadge = getPosteBadge(employee.poste || '')
                            const avatarColor = getAvatarColor(employee.firstName || 'A')

                            return (
                                <tr key={employee.employeId}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/50 transition-colors`}>
                                    {/* Employé */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold shadow-md`}>
                                                {getInitials(employee.firstName, employee.lastName)}
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-gray-900 text-base">
                                                    {employee.firstName} {employee.lastName}
                                                </div>
                                                <div
                                                    className="text-gray-600 text-sm flex items-center justify-center gap-1">
                                                    <Building2 className="h-4 w-4"/>
                                                    {employee.departement}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 text-gray-900">
                                            <span className="text-sm">{employee.email}</span>
                                        </div>
                                    </td>

                                    {/* Poste */}
                                    <td className="px-8 py-6 text-center">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${posteBadge.color}`}>
                                            <span className="mr-1">{posteBadge.icon}</span>
                                            {employee.poste}
                                        </span>
                                    </td>

                                    {/* Statut */}
                                    <td className="px-8 py-6 text-center">
                                        <span
                                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                                            <div className={`w-2 h-2 rounded-full ${status.dot} mr-2`}></div>
                                            {status.label}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => hook.openModalForEdit(employee)}
                                                    className="cursor-pointer p-3 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-all duration-200"
                                                    title="Modifier"
                                                >
                                                    <Edit className="h-5 w-5"/>
                                                </button>
                                                <button
                                                    onClick={() => hook.openConfirmModal(employee)}
                                                    className="cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-5 w-5"/>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EmployeesTab