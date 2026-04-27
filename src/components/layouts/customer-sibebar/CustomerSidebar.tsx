"use client"

import React, { useEffect } from "react";
import { RenderLink } from "@/components/layouts/customer-sibebar/RenderLink";
import SidebarHeader from "@/components/layouts/customer-sibebar/Sidebar-Header";
import { LinkItem } from "@/components/layouts/customer-sibebar/clientNavLink";

export interface TravelSidebarProps {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
    linkList: LinkItem[]

}

export default function TravelSidebar({ isOpen, onToggle, linkList }: TravelSidebarProps) {

    useEffect(() => {
        const handleResize = () => {
            onToggle(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [onToggle]);

    return (
        <>
            {/* Overlay pour mobile */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => onToggle(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 lg:w-1/5 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Header */}
                <SidebarHeader onClose={() => onToggle(false)} />

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <div className="mb-6">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Navigation
                        </h2>
                        {linkList.map((link: LinkItem, index: number) => (
                            <RenderLink
                                key={index}
                                linkItem={link}
                                onSidebarClose={() => onToggle(false)}
                            />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}