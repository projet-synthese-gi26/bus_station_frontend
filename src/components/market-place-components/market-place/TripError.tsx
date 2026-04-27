import React, {JSX} from "react";

export default function TripError({error}: {error: string|null}): JSX.Element
{
    return(
        <>
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                    {error}
                </p>
                <button
                    onClick={() => {
                        window.location.reload()
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </>
    )
}