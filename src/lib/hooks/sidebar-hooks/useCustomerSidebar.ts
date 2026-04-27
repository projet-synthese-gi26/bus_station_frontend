import { useState } from "react";

export function useCustomerSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return {
        isSidebarOpen,
        setIsSidebarOpen
    };
}