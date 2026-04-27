"use client";

import { useState } from "react";
import { Camera, Upload, User } from "lucide-react";
import Image from "next/image";

interface ProfilePhotoUploaderProps {
  profileImage: string | null;
  onUpload: (file: File) => void;
}

export default function ProfilePhotoUploader({ profileImage, onUpload }: ProfilePhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      onUpload(file);
    }
  };

  return (
    <div className="relative group">
      <div className="relative aspect-square w-32 h-32 rounded-full overflow-hidden bg-gray-100">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Photo de profil"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="w-16 h-16 text-blue-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <label htmlFor="profile-photo" className="cursor-pointer">
            <Upload className="w-6 h-6 text-blue-500" />
          </label>
        </div>
      </div>
      <input
        type="file"
        id="profile-photo"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
          En cours de chargement...
        </div>
      )}
    </div>
  );
}
