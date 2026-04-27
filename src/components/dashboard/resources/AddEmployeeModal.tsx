"use client"

import type React from "react"
import { X, User, Mail, Phone, Lock, Building2, Briefcase, DollarSign, UserCheck, Plus, Edit3 } from "lucide-react"
import type { useEmployeesTab } from "@/lib/hooks/dasboard/useEmployeesTab"
import InputField from "@/ui/InputField"
import SelectField from "@/ui/SelectField"
import {Tooltip} from "antd";

interface AddEmployeeModalProps {
    hook: ReturnType<typeof useEmployeesTab>
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ hook }) => {
    const { isModalOpen, closeModal, form, onSubmit, isSubmitting, apiError, editingEmployee } = hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form

    if (!isModalOpen) return null

    const isEditMode = !!editingEmployee

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-y-auto">
            {/* Header avec gradient */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            {isEditMode ? (
                                <Edit3 className="h-6 w-6 text-white" />
                            ) : (
                                <Plus className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {isEditMode ? "Modifier l'employé" : "Ajout d'un nouvel employé"}
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">
                                {isEditMode ? "Modifiez les informations de l'employé" : "Remplissez les informations de l'employé"}
                            </p>
                        </div>
                    </div>
                    <Tooltip placement={"top"} title={"Fermer"}>
                        <button
                            onClick={closeModal}
                            className="cursor-pointer flex items-center justify-center hover:bg-white/50 bg-white/30 w-10 h-10 rounded-full transition-colors backdrop-blur-sm"
                            title="Fermer"
                        >
                            <X className="h-6 w-6 text-white"/>
                        </button>
                    </Tooltip>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-primary/10 to-transparent rounded-b-2xl"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                                    <X className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-sm text-red-700 font-medium">{apiError}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Section Informations personnelles */}
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">Informations personnelles</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="first_name"
                                        label="Prénom"
                                        register={register("first_name")}
                                        error={errors.first_name?.message}
                                        placeholder="Ex: Marie"
                                        icon={<User className="h-5 w-5 text-gray-400" />}
                                    />
                                    <InputField
                                        id="last_name"
                                        label="Nom"
                                        register={register("last_name")}
                                        error={errors.last_name?.message}
                                        placeholder="Ex: Martin"
                                        icon={<User className="h-5 w-5 text-gray-400" />}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="phone_number"
                                        type="tel"
                                        label="Téléphone"
                                        register={register("phone_number")}
                                        error={errors.phone_number?.message}
                                        placeholder="+237 6XX XXX XXX"
                                        icon={<Phone className="h-5 w-5 text-gray-400" />}
                                    />
                                    <SelectField
                                        id="gender"
                                        label="Genre"
                                        register={register("gender")}
                                        error={errors.gender?.message}
                                        options={[
                                            { value: "MALE", label: "Homme" },
                                            { value: "FEMALE", label: "Femme" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Compte utilisateur */}
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">Compte utilisateur</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="username"
                                        label="Nom d'utilisateur"
                                        register={register("username")}
                                        error={errors.username?.message}
                                        placeholder="Ex: marie.martin"
                                        icon={<UserCheck className="h-5 w-5 text-gray-400" />}
                                    />
                                    <InputField
                                        id="email"
                                        type="email"
                                        label="Email"
                                        register={register("email")}
                                        error={errors.email?.message}
                                        placeholder="marie.martin@email.com"
                                        icon={<Mail className="h-5 w-5 text-gray-400" />}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="password"
                                        type="password"
                                        label={`Mot de passe ${isEditMode ? "(laisser vide pour ne pas changer)" : ""}`}
                                        register={register("password")}
                                        error={errors.password?.message}
                                        toggleVisibility={true}
                                        icon={<Lock className="h-5 w-5 text-gray-400" />}
                                    />
                                    <InputField
                                        id="confirmPassword"
                                        type="password"
                                        label="Confirmer le mot de passe"
                                        register={register("confirmPassword")}
                                        error={errors.confirmPassword?.message}
                                        toggleVisibility={true}
                                        icon={<Lock className="h-5 w-5 text-gray-400" />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Informations professionnelles */}
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">Informations professionnelles</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="poste"
                                        label="Poste"
                                        register={register("poste")}
                                        error={errors.poste?.message}
                                        placeholder="Ex: Responsable Commercial"
                                        icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                                    />
                                    <InputField
                                        id="departement"
                                        label="Département"
                                        register={register("departement")}
                                        error={errors.departement?.message}
                                        placeholder="Ex: Commercial"
                                        icon={<Building2 className="h-5 w-5 text-gray-400" />}
                                    />
                                </div>

                                <InputField
                                    id="salaire"
                                    type="number"
                                    label="Salaire (FCFA)"
                                    register={register("salaire")}
                                    error={errors.salaire?.message}
                                    placeholder="Ex: 150000"
                                    icon={<DollarSign className="h-5 w-5 text-gray-400" />}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer avec design amélioré */}
                <div className="flex items-center justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100 rounded-b-2xl">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                {isEditMode ? "Modification..." : "Création..."}
                            </>
                        ) : (
                            <>
                                {isEditMode ? (
                                    <Edit3 className="h-4 w-4"/>
                                ) : (
                                    <Plus className="h-4 w-4"/>
                                )}
                                {isEditMode ? "Enregistrer les modifications" : "Ajouter l'employé"}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="cursor-pointer px-6 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddEmployeeModal