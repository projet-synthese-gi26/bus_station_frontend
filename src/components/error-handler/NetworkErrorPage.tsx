'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw, WifiOff } from 'lucide-react';

export default function NetworkErrorPage() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect( () => {

        function handleOnline () {
            setIsOffline(false);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }

        function handleOffline ()  {
            setIsOffline(true);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    function handleRefresh  (){
        window.location.reload();
    }


    return (
        <div className="h-screen overflow-y-hidden flex justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8 relative">
                    <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center animate-pulse">
                        <WifiOff className="w-12 h-12 text-blue-600 " />
                    </div>
                    <div className="w-32 h-32 bg-blue-50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-pulse" />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Internet connection problem
                </h1>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    Check your internet connection and try again. We cannot load available trips at this time.
                </p>

                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
                >
                    <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Retry
                </button>
            </div>
        </div>
    );
}

