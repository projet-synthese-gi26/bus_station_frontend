"use client"
import {
    Plus,
    Edit,
    Trash2,
    Tag,
    AlertCircle,
    Search,
    DollarSign,
    TrendingDown,
    Star,
    Settings
} from "lucide-react"
import { useClassVoyageTab } from "@/lib/hooks/dasboard/useClassVoyageTab"
import AddClassVoyageModal from "./AddClassVoyageModal"
import Loader from "@/modals/Loader"
import TransparentModal from "@/modals/TransparentModal"
import { useState, useMemo } from "react"
import { ConfirmationModal } from "@/modals/ConfirmActionModal"

const ClassVoyageTab = () => {
    const hook = useClassVoyageTab()

    // État pour la recherche
    const [searchTerm, setSearchTerm] = useState("")

    // Filtrage des classes basé sur la recherche
    const filteredClasses = useMemo(() => {
        if (!searchTerm) return hook.classes

        return hook.classes.filter((classe) =>
            classe.nom?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [hook.classes, searchTerm])

    // Fonction pour obtenir le badge de prix
    const getPriceBadge = (prix: number) => {
        if (prix <= 5000) {
            return { color: "bg-green-100 text-green-800", label: "Budget", icon: "💰" }
        } else if (prix <= 15000) {
            return { color: "bg-blue-100 text-blue-800", label: "Standard", icon: "🎯" }
        } else {
            return { color: "bg-purple-100 text-purple-800", label: "Premium", icon: "⭐" }
        }
    }

    // Fonction pour obtenir le badge de taux d'annulation
    const getCancellationBadge = (taux: number) => {
        if (taux <= 5) {
            return { color: "bg-green-100 text-green-800", label: "Faible" }
        } else if (taux <= 15) {
            return { color: "bg-orange-100 text-orange-800", label: "Moyen" }
        } else {
            return { color: "bg-red-100 text-red-800", label: "Élevé" }
        }
    }

    // Fonction pour obtenir la couleur d'icône de classe
    const getClassColor = (nom: string) => {
        const colors = [
            "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400",
            "bg-indigo-400", "bg-yellow-400", "bg-red-400", "bg-teal-400"
        ]
        const charCode = nom.charCodeAt(0) || 0
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Classes de Voyage</h3>
                        <p className="text-gray-600">Gérez les différentes classes et niveaux de service</p>
                    </div>
                    <button
                        onClick={hook.openModalForCreate}
                        className="cursor-pointer flex items-center gap-3 bg-primary text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        Nouvelle Classe
                    </button>
                </div>

                {/* Barre de recherche */}
                <div className="relative max-w-md">
                    <Search className="group-hover:stroke-2 group-hover:stroke-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une classe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl hover:border-2 hover:border-primary focus:outline-none outline-none focus:border-2 focus:border-primary ring-0 transition-colors"
                    />
                </div>

                {/* Indicateur de résultats */}
                {searchTerm && (
                    <p className="mt-3 text-sm text-gray-600">
                        {filteredClasses.length} résultat(s) pour &quot;{searchTerm}&quot;
                    </p>
                )}
            </div>

            <TransparentModal isOpen={hook.isModalOpen}>
                <AddClassVoyageModal hook={hook} />
            </TransparentModal>

            <TransparentModal isOpen={hook.canOpenConfirmationModal}>
                <ConfirmationModal isOpen={true}
                    onClose={() => hook.setCanOpenConfirmationModal(false)}
                    onConfirm={hook.handleDelete}
                    title={"Supprimer la Classe"}
                    message={hook.confirmationMessage}
                />
            </TransparentModal>

            {/* Contenu principal */}
            {filteredClasses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <Tag className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? "Aucune classe trouvée" : "Aucune classe de voyage définie"}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        {searchTerm
                            ? "Essayez de modifier votre recherche"
                            : "Créez des classes pour offrir différents niveaux de service à vos clients."
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={hook.openModalForCreate}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Créer une classe
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
                                    <Tag className="h-5 w-5 text-primary" />
                                    Classe
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    Prix de Base
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    Catégorie
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-primary" />
                                    Taux d&apos;Annulation
                                </div>
                            </th>
                            <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Actions
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredClasses.map((cls, index) => {
                            const priceBadge = getPriceBadge(cls.prix || 0)
                            const cancellationBadge = getCancellationBadge(cls.tauxAnnulation || 0)
                            const classColor = getClassColor(cls.nom || '')

                            return (
                                <tr key={cls.idClassVoyage} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/50 transition-colors`}>
                                    {/* Classe */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className={`w-12 h-12 rounded-full ${classColor} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                                                {priceBadge.icon}
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-gray-900 text-base">{cls.nom}</div>
                                                <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
                                                    <Tag className="h-4 w-4" />
                                                    Classe de voyage
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Prix */}
                                    <td className="px-8 py-6 text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {cls.prix?.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">FCFA</div>
                                    </td>

                                    {/* Catégorie */}
                                    <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${priceBadge.color}`}>
                                                <span className="mr-1">{priceBadge.icon}</span>
                                                {priceBadge.label}
                                            </span>
                                    </td>

                                    {/* Taux d'annulation */}
                                    <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${cancellationBadge.color}`}>
                                                {cls.tauxAnnulation}% - {cancellationBadge.label}
                                            </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => hook.openModalForEdit(cls)}
                                                className="cursor-pointer p-3 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-all duration-200"
                                                title="Modifier"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => hook.openConfirmModal(cls)}
                                                className="cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
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

export default ClassVoyageTab