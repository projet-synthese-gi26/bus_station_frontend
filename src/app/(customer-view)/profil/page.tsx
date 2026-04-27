"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusStation } from '@/context/Provider';
import { User, Mail, Phone, KeyRound, Edit, X } from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { Customer } from '@/lib/types/models/BusinessActor';

// ===================================================================================
// DÉBUT DE LA LOGIQUE DE SIMULATION (uniquement pour les routes API manquantes)
// ===================================================================================

const LOCAL_STORAGE_KEY = 'persisted_user_profile_data';

async function mockUpdateProfile(currentUserData: Customer, updatedFields: Partial<Customer>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const finalUserData = { ...currentUserData, ...updatedFields };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalUserData));
    return finalUserData;
}

async function mockChangePassword(data: FieldValues): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (data.oldPassword !== "123456") {
        throw new Error("Ancien mot de passe incorrect (test: '123456')");
    }
    return { message: "Mot de passe changé avec succès (simulation)!" };
}

// ===================================================================================
// FIN DE LA LOGIQUE DE SIMULATION
// ===================================================================================


// --- Fonction utilitaire pour obtenir les initiales de l'utilisateur ---
const getInitials = (firstName?: string | null, lastName?: string | null): string => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};


// --- COMPOSANTS DES MODALES ET PROFILEFIELD (inchangés) ---
const ProfileField = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="flex items-start py-3">
        <div className="text-blue-600 mr-4 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-base text-gray-800">{value ?? 'Non renseigné'}</p>
        </div>
    </div>
);
const Modal = ({ children, title, onClose }: { children: React.ReactNode, title: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1"><X size={24} /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);
const EditProfileModal = ({ user, onClose, onUpdate }: { user: Customer, onClose: () => void, onUpdate: (newData: Customer) => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Partial<Customer>>({
        defaultValues: { first_name: user.first_name, last_name: user.last_name, phone_number: user.phone_number, age: user.age }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit = async (data: Partial<Customer>) => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const updatedUser = await mockUpdateProfile(user, data);
            onUpdate(updatedUser);
            onClose();
        } catch (error) { 
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("Une erreur est survenue.");
            }
        }
        finally { setIsSubmitting(false); }
    };

    return (
        <Modal title="Modifier le profil" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">Prénom</label>
                    <input {...register("first_name", { required: "Le prénom est requis" })} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Nom</label>
                    <input {...register("last_name", { required: "Le nom est requis" })} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <input {...register("phone_number")} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Âge</label>
                    <input type="number" {...register("age")} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (data: FieldValues) => {
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);
        try {
            const response = await mockChangePassword(data);
            setSuccessMessage(response.message);
            reset();
            setTimeout(onClose, 2000);
        } catch (error) { 
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("Une erreur est survenue.");
            }
        } 
        finally { setIsSubmitting(false); }
    };
     return (
        <Modal title="Changer le mot de passe" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">Ancien mot de passe</label>
                    <input type="password" {...register("oldPassword", { required: "Champ requis" })} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message as string}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <input type="password" {...register("newPassword", { required: "Champ requis", minLength: { value: 6, message: "6 caractères minimum" } })} className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>}
                </div>
                {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
                {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'Modification...' : 'Changer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE DE PROFIL ---
export default function ProfilPage() {
    const router = useRouter();
    const { userData: initialUserData, isLoading, isCustomerAuthenticated, isAgencyConnected, logout } = useBusStation();
    const isAuthenticated = (isCustomerAuthenticated || isAgencyConnected);
    const [displayUserData, setDisplayUserData] = useState<Customer | null>(null);
    const [modalOpen, setModalOpen] = useState<'edit' | 'password' | null>(null);
    // On n'a plus besoin de la référence pour le champ de fichier (useRef)

    useEffect(() => {
        if (initialUserData) {
            let finalUserData = { ...initialUserData };
            const persistedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (persistedData) {
                const parsedData = JSON.parse(persistedData);
                if (parsedData.userId === initialUserData.userId) {
                    finalUserData = { ...finalUserData, ...parsedData };
                }
            }
            setDisplayUserData(finalUserData);
        }
    }, [initialUserData]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/(authentication-pages)/login');
        }
    }, [isLoading, isAuthenticated, router]);
    
    // La fonction handleFileChange est maintenant inutile et a été supprimée
    
    const handleProfileUpdate = (updatedData: Customer) => {
        setDisplayUserData(updatedData);
    };

    if (isLoading || !displayUserData) {
        return <div className="flex justify-center items-center h-screen"><p>Chargement...</p></div>;
    }

    return (
        <>
            {modalOpen === 'edit' && <EditProfileModal user={displayUserData} onClose={() => setModalOpen(null)} onUpdate={handleProfileUpdate} />}
            {modalOpen === 'password' && <ChangePasswordModal onClose={() => setModalOpen(null)} />}

            <div className="p-4 sm:p-6 lg:p-8">
                 <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres du Compte</h1>
                    <p className="mt-1 text-gray-500">Gérez vos informations personnelles et de sécurité.</p>
                </header>
                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 p-8 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center text-center">
                            
                            {/* --- MODIFICATION ICI : AFFICHAGE SIMPLIFIÉ --- */}
                            <div className="w-24 h-24 rounded-full ring-4 ring-blue-200 bg-blue-600 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {getInitials(displayUserData.first_name, displayUserData.last_name)}
                                </span>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">{displayUserData.first_name} {displayUserData.last_name}</h2>
                            <p className="text-gray-500 mt-1">{displayUserData.email}</p>
                            <span className="mt-4 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                {displayUserData.role.join(', ')}
                            </span>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <ProfileField icon={<User size={20} />} label="Prénom" value={displayUserData.first_name} />
                                <ProfileField icon={<User size={20} />} label="Nom" value={displayUserData.last_name} />
                                <ProfileField icon={<User size={20} />} label="Nom d'utilisateur" value={displayUserData.username} />
                                <ProfileField icon={<User size={20} />} label="Âge" value={displayUserData.age ? displayUserData.age.toString() : 'Non renseigné'} />
                                <ProfileField icon={<Mail size={20} />} label="Email" value={displayUserData.email} />
                                <ProfileField icon={<Phone size={20} />} label="Téléphone" value={displayUserData.phone_number} />
                                 {/*  <ProfileField icon={<Mail size={20} />} label="Adresse" value={displayUserData.address} />   */}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                                <button onClick={() => setModalOpen('edit')} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                                    <Edit size={16} className="mr-2" />
                                    Modifier le Profil
                                </button>
                                <button onClick={() => setModalOpen('password')} className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
                                    <KeyRound size={16} className="mr-2" />
                                    Changer le mot de passe
                                </button>
                                <button onClick={logout} className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 md:ml-auto">
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}