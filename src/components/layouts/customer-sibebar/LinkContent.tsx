import {ChevronRight} from "lucide-react";
import React from "react";
import {LinkItem} from "@/components/layouts/customer-sibebar/clientNavLink";


export interface LinkContentProps {
    Icon: React.ElementType,
    isActive: boolean,
    isSubLink: boolean,
    linkItem: LinkItem,
    isExpanded: boolean,
    hasSubLinks: boolean
}


export default function LinkContent({Icon, isActive, isSubLink, linkItem, isExpanded, hasSubLinks }: LinkContentProps)
{
    return (
        <div className={`group relative flex items-center gap-3 rounded-xl p-3 transition-all duration-300 ${isSubLink ? "ml-4" : ""} ${isActive ? "bg-primary text-white shadow-lg transform scale-[1.02]" : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:via-blue-100 hover:to-purple-50 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.01]"}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 group-hover:from-blue-100 group-hover:to-purple-100"}`}>
                <Icon className="h-5 w-5"/>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span
                        className={`font-semibold text-sm truncate ${isActive ? "text-white" : "text-gray-900"}`}>
                        {linkItem.name}
                    </span>
                    {linkItem.badge && (
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${isActive ? "bg-white/20 text-white" : "bg-primary text-white"}`}>
                            {linkItem.badge}
                        </span>
                    )}
                </div>
                {linkItem.description && (
                    <p className={`text-xs truncate mt-0.5${isActive ? "text-white/80" : "text-gray-500"}`}>
                        {linkItem.description}
                    </p>
                )}
            </div>

            {hasSubLinks && (
                <div className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
                    <ChevronRight className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`}/>
                </div>
            )}
        </div>
    )
}