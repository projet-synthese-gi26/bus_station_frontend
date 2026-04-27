import type React from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { ChevronDown } from "lucide-react"

export interface Option {
    label: string
    value: string
}

export interface SelectFieldProps {
    id: string
    name?: string
    label: string
    options: Option[]
    required?: boolean
    register?: UseFormRegisterReturn
    error?: string
    icon?: React.ReactNode
    disabled?:boolean
}

export default function SelectField({id, name, label, options, required = false, register, error, icon, disabled}: SelectFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 z-10">{icon}</div>}
                <select
                    disabled={disabled}
                    id={id}
                    name={name}
                    className={`w-full cursor-pointer appearance-none ${icon ? "pl-10" : "pl-4"} pr-10 py-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 
                    ${error ? "focus:ring-red-500" : "focus:ring-blue-600"} focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-blue-400`}
                    required={required}
                    {...register}
                >
                    <option value="" disabled hidden>
                        Select a type
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>


                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="h-5 w-5" />
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}
