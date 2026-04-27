"use client";
import NavBar from "@/components/layouts/customer-navbar/CustomerNavBar";
import Sidebar from "@/components/layouts/customer-sibebar/CustomerSidebar";
import Footer from "@/components/layouts/Footer";
import { useCustomerSidebar } from "@/lib/hooks/sidebar-hooks/useCustomerSidebar";
import React from "react";
import {linkList} from "@/components/layouts/customer-sibebar/clientNavLink";

export default function Layout({ children }: { children: React.ReactNode }) {


    const { isSidebarOpen, setIsSidebarOpen } = useCustomerSidebar();

    return (
        <div className="flex min-h-screen flex-col gap-4">
            <div className="flex h-screen overflow-hidden">
                <Sidebar
                    linkList={linkList}
                    isOpen={isSidebarOpen}
                    onToggle={setIsSidebarOpen}
                />
                <div className="flex-1 flex flex-col">
                    <NavBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-4">
                        {children}
                    </main>
                </div>
            </div>
            <Footer/>
        </div>
    );
}