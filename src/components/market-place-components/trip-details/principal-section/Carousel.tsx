import React, {JSX} from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight, Star} from "lucide-react";
import {useTripDetails} from "@/lib/hooks/market-place/useTripDetails";
import {Trip} from "@/lib/types/models/Trip";


export default function Carousel({tripDetails}: {tripDetails: Trip}): JSX.Element
{
    const tripDetailHook = useTripDetails(tripDetails.idVoyage);
    return (
        <>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg group mt-5">
                <div
                    className="flex w-full h-full transition-transform duration-500 ease-in-out"
                    style={{transform: `translateX(-${tripDetailHook.currentImageIndex * 100}%)`}}
                >
                    {tripDetailHook.images.map((image, index) => (
                        <div key={index} className="min-w-full h-full flex-shrink-0 relative">
                            <Image
                                src={image || "/placeholder.svg"}
                                alt={`Trip image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"/>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <button
                    onClick={tripDetailHook.previousImage}
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="h-6 w-6 text-white"/>
                </button>
                <button
                    onClick={tripDetailHook.nextImage}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="h-6 w-6 text-white"/>
                </button>

                {/* Indicateurs */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {tripDetailHook.images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === tripDetailHook.currentImageIndex ? "bg-white w-8" : "bg-white/50"
                            }`}
                            onClick={() => tripDetailHook.setCurrentImageIndex(index)}
                        />
                    ))}
                </div>

                {/* Overlay avec titre */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current"/>
                        <span className="text-sm font-medium">
                                   {tripDetails.nomClasseVoyage}
                                </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        {tripDetails.lieuDepart} → {tripDetails.lieuArrive}
                    </h1>
                    <p className="text-lg opacity-90">Travel comfortably with {tripDetails.nomAgence}</p>
                </div>
            </div>
        </>
    )
}