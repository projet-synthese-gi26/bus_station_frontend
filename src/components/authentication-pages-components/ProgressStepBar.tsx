import {Check} from "lucide-react";
import React, {JSX} from "react";

export default function ProgressStepBar({step}: {step:number}): JSX.Element
{
    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                <ol className="flex items-center w-full max-w-3xl">
                    {[1, 2, 3].map((stepNumber) => (
                        <li key={stepNumber} className={`flex items-center ${stepNumber < 3 ? "w-full" : ""}`}>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} transition-colors duration-300`}>
                                {step > stepNumber ? <Check className="w-5 h-5"/> : <span>{stepNumber}</span>}
                            </div>
                            {stepNumber < 3 && (<div className={`flex-1 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"} transition-colors duration-300`}></div>)}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex justify-between max-w-3xl mx-auto mt-2 text-xs text-gray-600">
                <div className="text-center">
                    <span className={step >= 1 ? "font-medium text-blue-600" : ""}>Personal information</span>
                </div>
                <div className="text-center">
                    <span className={step >= 2 ? "font-medium text-blue-600" : ""}>Account type</span>
                </div>
                <div className="text-center">
                    <span className={step >= 3 ? "font-medium text-blue-600" : ""}>Agency details</span>
                </div>
            </div>
        </div>
    )
}