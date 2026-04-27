import { Check } from "lucide-react";
import React, {JSX} from "react";
import {AccountTypeCardProps} from "@/lib/types/ui";






export default function AccountTypeCard ({ selected, onSelect, icon, title, description, features }: AccountTypeCardProps) : JSX.Element {
    return (
        <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selected ? "border-primary bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
            onClick={onSelect}
        >
            <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
                <h3 className="ml-4 text-lg font-medium">{title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{description}</p>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
