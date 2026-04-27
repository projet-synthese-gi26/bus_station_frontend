// components/dashboard/BookingStatusBadge.tsx

import React from 'react';

interface BookingStatusBadgeProps {
    status: string;
    statusInfo: {
        text: string;
        color: string;
        dot: string;
    };
}

export default function BookingStatusBadge({ status, statusInfo }: BookingStatusBadgeProps) {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
            {statusInfo.text}
        </div>
    );
}