"use client"


import LoadingText from "@/components/loading-page-components/LoadingText";
import ProgressBar from "@/ui/ProgressBar";
import AirplaneAnimation from "@/components/loading-page-components/AirplaneAnimation";
import LogoAnimation from "@/components/loading-page-components/LogoAnimation";
import {JSX} from "react";

export default function Loading():JSX.Element {
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center z-50">
            <div className="w-full max-w-md px-4">
               <LogoAnimation/>
               <AirplaneAnimation/>
               <LoadingText/>
               <ProgressBar/>
            </div>
        </div>
    )
}
