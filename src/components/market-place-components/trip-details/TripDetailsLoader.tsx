import React, {JSX} from "react";

export default function TripDetailsLoader(): JSX.Element
{
    return(
        <>
            <div className="min-h-screen p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-96"></div>
                            <div className="bg-gray-200 rounded-2xl h-96"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}