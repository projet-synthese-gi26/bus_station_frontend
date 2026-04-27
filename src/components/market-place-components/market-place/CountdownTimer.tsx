"use client";

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    departureDateTime: string;
}

const CountdownTimer = ({ departureDateTime }: CountdownTimerProps) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(departureDateTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const TimeBox = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg text-xl font-bold text-red-500">
                {String(value).padStart(2, '0')}
            </div>
            <span className="text-xs text-red-500 mt-1 uppercase tracking-wider">{label}</span>
        </div>
    );

    const { days, hours, minutes, seconds } = timeLeft as { days: number, hours: number, minutes: number, seconds: number };

    if (days === undefined) {
        return <div className="text-center font-semibold text-red-500 my-4">Départ imminent ou passé</div>;
    }

    return (
        <div className="my-4">
            <h4 className="text-center text-sm font-semibold text-red-700 mb-2">Départ dans :</h4>
            <div className="flex justify-center items-start space-x-2">
                {days > 0 && <TimeBox value={days} label="Jours" />}
                {days > 0 && <span className="font-bold text-red-500 text-2xl">:</span>}
                <TimeBox value={hours} label="Hrs" />
                <span className="font-bold text-red-500 text-2xl">:</span>
                <TimeBox value={minutes} label="Min" />
                <span className="font-bold text-red-500 text-2xl">:</span>
                <TimeBox value={seconds} label="Sec" />
            </div>
        </div>
    );
};

export default CountdownTimer;
