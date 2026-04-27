import React from 'react';
import { XIcon, CreditCard, ArrowLeft } from 'lucide-react';
import {usePayment} from "@/lib/hooks/market-place/usePayment";
import {Reservation} from "@/lib/types/models/Reservation";
import InputField from "@/ui/InputField";
import {useBusStation} from "@/context/Provider";

export interface PaymentRequestModalInterface {
    onClose: ()=> void,
    reservationSuccessMessage?: string
    reservation?: Reservation
}

export function PaymentModal({  onClose, reservationSuccessMessage, reservation}: PaymentRequestModalInterface) {

    const paymentManager = usePayment(reservation);
    const {userData} = useBusStation();

    return (
        <div className="bg-white rounded-lg shadow-xl lg:rounded-xl  rounded-xl lg:max-w-4xl md:max-w-[800px] sm:max-w-[370px] max-w-[330px]">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="lg:text-2xl  md:text-2xl text-xl font-semibold text-primary">
                        {paymentManager.step === 1 ? "Confirm Payment" : "Payment Details"}
                    </h2>
                    <button onClick={() => {paymentManager.setStep(1); onClose()}} className="w-8 h-8 bg-red-100 flex justify-center items-center rounded-full cursor-pointer text-red-500 hover:text-red-700">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>



                {paymentManager.step === 1 ? (
                    <>
                        {reservationSuccessMessage && <p className="mt-2 mb-4 text-green-500 font-semibold text-md">{reservationSuccessMessage}</p>}
                        <div className="space-y-6">
                            <p className="text-center lg:text-lg md:text-md text-md text-gray-600">
                                Are you ready to proceed with the payment?
                            </p>
                            <div className="flex justify-center">
                                <div className="bg-blue-100 rounded-full lg:p-3 p-2">
                                    <CreditCard className="lg:h-8 lg:w-8 w-7 h-7 text-primary"/>
                                </div>
                            </div>
                            <p className="text-center lg:text-xl md:text-lg text-md font-semibold">
                                Total Amount: {paymentManager.amount} FCFA
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={paymentManager.handleConfirmPayment}
                                    className="cursor-pointer flex-1 lg:px-4 lg:py-2 px-2 py-1 lg:text-md text-sm font-semibold  bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Proceed to Payment
                                </button>
                                <button
                                    onClick={() => {
                                        sessionStorage.removeItem("createdReservation");
                                        paymentManager.setStep(1);
                                        onClose()
                                    }}
                                    className="cursor-pointer flex-1 lg:px-4 py-2 px-2  bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Not Now
                                </button>
                            </div>
                        </div>
                    </>

                ) : (
                    <form onSubmit={paymentManager.handleSubmit(paymentManager.handleSubmitPayment)}
                          className="space-y-4">
                        {paymentManager.axiosPaymentError &&
                            <p className="text-red-500 mt-2 mb-4  text-sm font-semibold">{paymentManager.axiosPaymentError}</p>}

                        <InputField
                            id={"mobilePhone"}
                            type={"text"}
                            label={"Enter your phone number"}
                            placeholder={"6XXXXXXXX"}
                            register={paymentManager.register("mobilePhone")}
                            error={paymentManager.errors.mobilePhone?.message}
                        />

                        <InputField
                            id={"name"}
                            type={"text"}
                            label={"Enter your name"}
                            placeholder={"John Doe"}
                            register={paymentManager.register("mobilePhoneName")}
                            error={paymentManager.errors.mobilePhoneName?.message}
                        />

                        <InputField
                            id={"amount"}
                            type="number"
                            placeholder={"2500"}
                            label={"Enter the amount you want to pay"}
                            register={paymentManager.register("amount")}
                            error={paymentManager.errors.amount?.message}
                        />

                        {/* Champ caché pour userId */}
                        <input
                            type="hidden"
                            {...paymentManager.register("userId")}
                            value={userData?.userId || ""}
                        />

                        {/* Champ caché pour idReservation */}
                        <input
                            type="hidden"
                            {...paymentManager.register("reservationId")}
                            value={paymentManager.currentReservation?.idReservation || ""}
                        />

                        <div className="flex justify-between pt-4 gap-5">
                            <button
                                type="button"
                                onClick={() => paymentManager.setStep(1)}
                                className="cursor-pointer flex items-center px-4 py-2 bg-gray-200 font-semibold text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={paymentManager.isLoading}
                                className="cursor-pointer px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {paymentManager.isLoading ? "Processing..." : "Complete Payment"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}