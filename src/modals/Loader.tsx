import React, {JSX} from "react";
import {Loader2} from "lucide-react";


interface LoaderProps {
    message?: string
}

export default function Loader({message}: LoaderProps): JSX.Element{
    return (
        <div className="bg-white h-[150px] w-[220px] rounded-xl flex flex-col justify-center items-center">
            <Loader2 className="text-primary animate-spin w-12 h-12"/>
            <p className="text-primary font-semibold text-sm mt-4">{message ? message : "Un instant s'il vous plait ..."}</p>
        </div>
    )
}