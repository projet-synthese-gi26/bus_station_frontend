import React from "react";
import {TextareaFieldProps} from "@/lib/types/ui";



export default function TextareaField({id, name, label, placeholder, rows = 3, required = false, icon, register, error,}: TextareaFieldProps): React.JSX.Element {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && <div className="absolute top-3 left-3 pointer-events-none">{icon}</div>}
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full px-4 py-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} ${icon ? "pl-10" : ""}`}
                    {...register}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
