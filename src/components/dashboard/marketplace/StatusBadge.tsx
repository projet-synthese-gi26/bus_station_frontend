import React from 'react';

const StatusConfig = {
    PUBLIE: {
        text: "Publié",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500"
    },
    EN_COURS: {
        text: "En cours",
        color: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500"
    },
    TERMINE: {
        text: "Terminé",
        color: "bg-gray-100 text-gray-700",
        dot: "bg-gray-500"
    },
    ANNULE: {
        text: "Annulé",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500"
    }
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusInfo = StatusConfig[status as keyof typeof StatusConfig] || StatusConfig.PUBLIE;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
            {statusInfo.text}
        </div>
    );
}