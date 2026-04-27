import React from "react";
import {Trip} from "@/lib/types/models/Trip";
import Carousel from "@/components/market-place-components/trip-details/principal-section/Carousel";
import ReservationCard from "@/components/market-place-components/trip-details/principal-section/ReservationCard";

export interface PrincipalSectionInterface
{
    tripDetails: Trip,
    setCanOpenReservationModal: (param: boolean)=> void
}

export default function PrincipalSection({tripDetails, setCanOpenReservationModal}:PrincipalSectionInterface)
{

    return(
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Galerie d'images */}
                <div className="lg:col-span-2">
                    <Carousel tripDetails={tripDetails}/>
                </div>

                {/* Carte de réservation */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <ReservationCard
                        tripDetails={tripDetails}
                        setCanOpenReservationModal={setCanOpenReservationModal}
                    />
                </div>
            </div>
        </>
    )
}