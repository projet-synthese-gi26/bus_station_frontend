'use client';



import NotFoundSVG from "@/components/error-handler/NotFoundSVG";

export default function NoTripsPage({isSearch}: {isSearch: boolean}) {


    return (
        <div className="h-screen flex justify-center overflow-y-hidden">
            <div className="max-w-2xl w-full text-center justify-center">
                <div className="w-full justify-center flex">
                    {/*<Image src={noTrip} alt={"no trip found"}  className="w-[300px] h-[300px]"/>*/}
                    <NotFoundSVG/>
                </div>
                <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">
                    {isSearch ? "No trips found" : "No trips planned"}
                </h1>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto text-md">
                    {isSearch ? "There are currently no trips scheduled for this destination. Try changing your search criteria or come back later."  : "There are currently no trips planned, come back later!!"}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-6 py-3 hover:bg-blue-800 bg-reservation-color text-md hover:text-xl text-white font-medium rounded-lg  transition-all duration-300"
                    >
                        Refresh page
                    </button>

                    {isSearch && (
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-sm text-gray-500">Suggestions :</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                    Changer de date
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                    Autre destination
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                    Autre agence
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

