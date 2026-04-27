// src/modals/AddTripModal.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlannerTrip } from '@/lib/types/models/Trip';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PlannerTrip, 'id'>) => Promise<void>;
  agencyId: string;
}

const tripSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  dayOfWeek: z.coerce.number().min(1).max(7),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Format HH:MM invalide."}),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Format HH:MM invalide."}),
  category: z.string().min(1, { message: "La catégorie est requise." }),
});

export default function AddTripModal({ isOpen, onClose, onSave, agencyId }: AddTripModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<PlannerTrip, 'id' | 'agencyId'>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: '',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '11:00',
      category: 'Classic',
    }
  });

  const onSubmit = async (data: Omit<PlannerTrip, 'id' | 'agencyId'>) => {
    const dataToSave = {
      ...data,
      agencyId: agencyId,
    };
    await onSave(dataToSave as Omit<PlannerTrip, 'id'>);
    reset(); // Reset form after saving
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau voyage au planning</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre du voyage</label>
            <input {...register('title')} id="title" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">Jour</label>
                <select {...register('dayOfWeek')} id="dayOfWeek" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="1">Lundi</option>
                    <option value="2">Mardi</option>
                    <option value="3">Mercredi</option>
                    <option value="4">Jeudi</option>
                    <option value="5">Vendredi</option>
                    <option value="6">Samedi</option>
                    <option value="7">Dimanche</option>
                </select>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select {...register('category')} id="category" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Classic">Classic</option>
                    <option value="VIP">VIP</option>
                    <option value="Premium">Premium</option>
                    <option value="Nocturne">Nocturne</option>
                </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Heure de début</label>
              <input type="time" {...register('startTime')} id="startTime" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
              {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Heure de fin</label>
              <input type="time" {...register('endTime')} id="endTime" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button type="submit" className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
