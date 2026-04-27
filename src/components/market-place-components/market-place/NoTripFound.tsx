import React, {JSX} from "react";

export default function NoTripFound(): JSX.Element
{
    return(
        <>
            <div className="flex flex-col items-center justify-center mt-16 py-10 px-6 text-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun voyage trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                    Aucun voyage ne correspond à vos critères de recherche actuels.
                </p>
                <button
                    onClick={() => {/* Fonction pour réinitialiser les filtres */
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Réinitialiser les filtres
                </button>
            </div>
        </>
    )
}