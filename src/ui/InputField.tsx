import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import {InputFieldProps} from "@/lib/types/ui";



export default function InputField({id, name, label, placeholder, type = "text", icon, required = false, toggleVisibility = false, register, error,}: InputFieldProps) {

    const [showPassword, setShowPassword] = useState(false);
    const inputType = toggleVisibility ? (showPassword ? "text" : "password") : type;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    className={`${icon ? 'pl-10' : 'pl-3'}  ${toggleVisibility ? "pr-10" : ""} w-full px-4 py-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                    required={required}
                    {...register}
                />
                {toggleVisibility && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
