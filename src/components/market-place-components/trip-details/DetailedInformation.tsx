import React, {JSX} from "react";
import {FaInfoCircle, FaLandmark, FaStar, FaTools} from "react-icons/fa";
import {CheckCircle, Clock, XCircle} from "lucide-react";
import {MdAirlineSeatReclineNormal} from "react-icons/md";
import {Trip} from "@/lib/types/models/Trip";
import {equipmentOnBusType} from "@/lib/hooks/market-place/useTripDetails";
import {formatDateToTime} from "@/lib/services/date-services";


interface DetailsInformationComponentPropsInterface {
    tripDetails: Trip,
    equipmentsOnBus: equipmentOnBusType[]
}
export default function DetailedInformation({tripDetails, equipmentsOnBus}: DetailsInformationComponentPropsInterface): JSX.Element
{
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Principal Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trip Details */}
                    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                    <FaStar className="h-6 w-6 text-yellow-500"/>
                                </div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-semibold text-gray-900">{tripDetails.nomClasseVoyage}</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 rounded-full  bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                    <Clock className="h-6 w-6 text-blue-600"/>
                                </div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-semibold text-gray-900">{tripDetails.dureeVoyage}</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 rounded-full  bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                    <Clock className="h-6 w-6 text-green-600"/>
                                </div>
                                <p className="text-sm text-gray-500">Arrival</p>
                                <p className="font-semibold text-gray-900">{formatDateToTime(tripDetails.heureArrive ?? "")}</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 rounded-full  bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                    <MdAirlineSeatReclineNormal className="h-6 w-6 text-purple-600"/>
                                </div>
                                <p className="text-sm text-gray-500">Available Seats</p>
                                <p className="font-semibold text-gray-900">
                                    {tripDetails.nbrPlaceReservable}/{tripDetails.nbrPlaceRestante}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FaInfoCircle className="h-5 w-5 text-blue-600"/>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">About This Trip</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{tripDetails.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FaTools className="h-5 w-5 text-blue-600"/>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Amenities & Services</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {equipmentsOnBus.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg  hover:bg-blue-200  transition-all duration-300"
                                >
                                    <item.icon className={`h-5 w-5 ${item.color}`}/>
                                    <span className="text-gray-700 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Policy */}
                <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FaLandmark className="h-5 w-5 text-blue-600"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Booking Policy</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle className="h-5 w-5 text-green-600"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Flexible Booking</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• 30% deposit required at booking</li>
                                    <li>• Balance due 45 days before departure</li>
                                    <li>• Valid passport required (6 months validity)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <XCircle className="h-5 w-5 text-orange-600"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• More than 45 days: 150€ fee</li>
                                    <li>• 45-30 days: 30% of total amount</li>
                                    <li>• Less than 30 days: 50% of total amount</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}