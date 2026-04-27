import {Building, User} from "lucide-react"
import React from "react";

import AccountTypeCard from "@/ui/AccountTypeCard";
import {UserAccountTypeProps} from "@/lib/types/ui";



export default function UserAccountType({createAgency, setCreateAgencyAction}: UserAccountTypeProps) {

    const regularUserAccountFeatures: string[] =[
        "Access to marketplace",
        "Trip booking",
        "Profile management"
    ];

    const agencyAccountFeatures: string[] =[
        "Agency dashboard",
        "Offer publication",
        "Reservation management"
    ];


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regular User Option*/}
            <AccountTypeCard
                selected={!createAgency}
                onSelect={() => setCreateAgencyAction(false)}
                icon={<User className="h-6 w-6 text-blue-600" />}
                title="Customer"
                description="Create a personal account to search and book trips."
                features={regularUserAccountFeatures}
            />

            {/*Agency Section */}
            <AccountTypeCard
                selected={createAgency}
                onSelect={() => setCreateAgencyAction(true)}
                icon={<Building className="h-6 w-6 text-blue-600" />}
                title="Travel Agency"
                description="Create a professional account to offer your travel services."
                features={agencyAccountFeatures}
            />
        </div>
    )
}