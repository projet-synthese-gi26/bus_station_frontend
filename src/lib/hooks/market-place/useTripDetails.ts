import { JSX, useCallback, useEffect, useState } from "react";
import { Coffee, Shield, Usb, Wifi } from "lucide-react";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { retrieveTripDetail } from "@/lib/services/trip-service";
import { Trip } from "@/lib/types/models/Trip";

export type equipmentOnBusType = {
  icon: JSX.ElementType;
  label: string;
  color: string;
};

export function useTripDetails(idVoyage: string) {
  const [reservationSuccessMessage, setReservationSuccessMessage] =
    useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [canOpenPaymentModal, setCanOpenPaymentModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tripDetails, setTripDetail] = useState<Trip>({
    amenities: [],
    bigImage: "",
    dateArriveEffectif: "",
    dateDepartEffectif: "",
    dateDepartPrev: "",
    dateLimiteConfirmation: "",
    dateLimiteReservation: "",
    datePublication: "",
    description: "",
    dureeVoyage: "",
    heureArrive: "",
    heureDepartEffectif: "",
    idVoyage: "",
    lieuArrive: "",
    lieuDepart: "",
    nbrPlaceReservable: 0,
    nbrPlaceRestante: 0,
    nomAgence: "",
    nomClasseVoyage: "",
    nbrPlaceReserve: 0,
    pointArrivee: "",
    pointDeDepart: "",
    prix: 0,
    smallImage: "",
    statusVoyage: "EN_ATTENTE",
    titre: "",
    vehicule: {
      idVehicule: "",
      nom: "",
      modele: "",
      description: "",
      nbrPlaces: 0,
      lienPhoto: "",
      idAgenceVoyage: "",
      plaqueMatricule: "",
    },
  });
  const [canOpenReservationModal, setCanOpenReservationModal] =
    useState<boolean>(false);
  const [axiosError, setAxiosError] = useState<string | null>(null);
  const images = [
    // tripDetails && tripDetails.smallImage,
    tripDetails && tripDetails.bigImage,
    tripDetails && tripDetails.bigImage,
  ];
  const equipmentsOnBus: equipmentOnBusType[] = [
    { icon: Wifi, label: "Free WiFi", color: "text-blue-600" },
    { icon: Coffee, label: "Meals & Drinks", color: "text-orange-600" },
    { icon: Usb, label: "USB Charging", color: "text-green-600" },
    {
      icon: MdAirlineSeatReclineNormal,
      label: "Reclining Seats",
      color: "text-purple-600",
    },
    { icon: Shield, label: "Insurance", color: "text-blue-600" },
  ];

  async function fetchTripDetails(idVoyage: string) {
    if (!idVoyage || idVoyage === "")
      throw new Error("id Voyage must no be null or empty");
    setIsLoading(true);
    setAxiosError(null);
    await retrieveTripDetail(idVoyage)
      .then((result) => {
        if (result) {
          setTripDetail(result);
        } else {
          setAxiosError(
            "Something went wrong when retrieving the trip details, please refresh !"
          );
        }
      })
      .catch(() => {
        setAxiosError(
          "Something went wrong when retrieving the trip details, please refresh !"
        );
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (idVoyage) {
      fetchTripDetails(idVoyage).then(() => console.log("success !"));
    }
  }, [idVoyage]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return {
    nextImage,
    previousImage,
    equipmentsOnBus,
    currentImageIndex,
    isLoading,
    images,
    setCurrentImageIndex,
    setCanOpenReservationModal,
    canOpenReservationModal,
    tripDetails,
    axiosError,
    canOpenPaymentModal,
    setCanOpenPaymentModal,
    reservationSuccessMessage,
    setReservationSuccessMessage,
  };
}
