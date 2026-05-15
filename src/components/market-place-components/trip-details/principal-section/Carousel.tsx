import React, { JSX, useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Trip } from "@/lib/types/models/Trip";

export default function Carousel({ tripDetails }: { tripDetails: Trip }): JSX.Element {
    const images = [tripDetails.bigImage, tripDetails.smallImage].filter(Boolean) as string[];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
    }, [images.length]);

    const previousImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
    }, [images.length]);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(nextImage, 5000);
        return () => clearInterval(timer);
    }, [nextImage, images.length]);

    return (
        <div className="relative h-125 rounded-2xl overflow-hidden shadow-lg group mt-5">
            <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
                {images.length > 0 ? images.map((image, index) => (
                    <div
                        key={index}
                        className="min-w-full h-full shrink-0 relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
                    >
                        <img
                            src={image}
                            alt={`Trip image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                )) : (
                    <div className="min-w-full h-full shrink-0 relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={previousImage}
                        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 rounded-full transition-all duration-200 ${
                                    index === currentImageIndex ? "bg-white w-8" : "bg-white/50 w-2"
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{tripDetails.nomClasseVoyage}</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">
                    {tripDetails.lieuDepart} → {tripDetails.lieuArrive}
                </h1>
                <p className="text-lg opacity-90">Travel comfortably with {tripDetails.nomAgence}</p>
            </div>
        </div>
    );
}