import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Définir un type pour les mises à jour de siège
interface SeatUpdate {
    placeNumber: number;
    status: 'RESERVED' | 'FREE';
}

export function useSeatManager(tripId?: string) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [temporaryReservedSeats, setTemporaryReservedSeats] = useState<number[]>([]); // Places réservées via WebSocket
    const [permanentOccupiedSeats, setPermanentOccupiedSeats] = useState<number[]>([]); // Places définitivement occupées du voyage
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // WebSocket refs
    const stompClient = useRef<Client | null>(null);
    const connectionRetries = useRef(0);
    const maxRetries = 3;

    // Garder une trace des places que NOUS avons sélectionnées
    const mySelectedSeats = useRef<number[]>([]);

    const syncWithServer = useCallback((updates: SeatUpdate[]) => {
        const reservedByOthers = new Set<number>();
        const freedByOthers = new Set<number>();

        updates.forEach(update => {
            if (mySelectedSeats.current.includes(update.placeNumber)) return;

            if (update.status === 'RESERVED') {
                reservedByOthers.add(update.placeNumber);
            } else if (update.status === 'FREE') {
                freedByOthers.add(update.placeNumber);
            }
        });

        setTemporaryReservedSeats(prev => {
            const newReserved = new Set(prev);
            reservedByOthers.forEach(seat => newReserved.add(seat));
            freedByOthers.forEach(seat => newReserved.delete(seat));
            return Array.from(newReserved);
        });
    }, []);

    const requestInitialState = useCallback(() => {
        if (stompClient.current && stompClient.current.connected && tripId) {
            stompClient.current.publish({
                destination: `/app/voyage/${tripId}/get-state`,
                body: JSON.stringify({})
            });
        }
    }, [tripId]);

    // Initialiser WebSocket si tripId est fourni
    useEffect(() => {
        if (!tripId) return;

        const connectWebSocket = () => {
            const client = new Client({
                webSocketFactory: () => new SockJS("https://agence-voyage.ddns.net/api/ws"),
                onConnect: () => {
                    setIsConnected(true);
                    setIsConnecting(false);
                    connectionRetries.current = 0;

                    client.subscribe(`/topic/voyage.${tripId}`, (message) => {
                        const updates = JSON.parse(message.body);
                        if (Array.isArray(updates)) {
                            syncWithServer(updates);
                        }
                    });

                    setTimeout(() => requestInitialState(), 500);
                },
                onStompError: (error) => {
                    console.error('WebSocket error:', error);
                    setIsConnected(false);
                    setIsConnecting(false);
                    handleReconnection();
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket connection error:', error);
                    setIsConnected(false);
                    setIsConnecting(false);
                    handleReconnection();
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            client.activate();
            stompClient.current = client;
        };

        const handleReconnection = () => {
            if (connectionRetries.current < maxRetries) {
                connectionRetries.current++;
                setTimeout(() => {
                    setIsConnecting(true);
                    connectWebSocket();
                }, 2000 * connectionRetries.current);
            } else {
                console.error('Échec de la connexion WebSocket après plusieurs tentatives');
                setIsConnecting(false);
            }
        };

        setIsConnecting(true);
        setIsConnected(false);
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [tripId, syncWithServer, requestInitialState]);

    const releaseAllSeats = useCallback(() => {
        const client = stompClient.current;
        if (client && client.connected && tripId && mySelectedSeats.current.length > 0) {
            mySelectedSeats.current.forEach(seatNumber => {
                client.publish({
                    destination: `/app/voyage/${tripId}/reserver`,
                    body: JSON.stringify({ placeNumber: seatNumber, status: 'FREE' })
                });
            });
        }
        setSelectedSeats([]);
        mySelectedSeats.current = [];
    }, [tripId]);

    useEffect(() => {
        return () => {
            releaseAllSeats();
        };
    }, [releaseAllSeats]);

    function handleSeatClick(seatNumber: number): void {
        if (permanentOccupiedSeats.includes(seatNumber) || temporaryReservedSeats.includes(seatNumber)) {
            return;
        }

        const isCurrentlySelected = selectedSeats.includes(seatNumber);

        if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(seat => seat !== seatNumber));
            mySelectedSeats.current = mySelectedSeats.current.filter(seat => seat !== seatNumber);

            if (stompClient.current && stompClient.current.connected && tripId) {
                stompClient.current.publish({
                    destination: `/app/voyage/${tripId}/reserver`,
                    body: JSON.stringify({ placeNumber: seatNumber, status: 'FREE' })
                });
            }
        } else {
            setSelectedSeats(prev => [...prev, seatNumber]);
            mySelectedSeats.current = [...mySelectedSeats.current, seatNumber];

            if (stompClient.current && stompClient.current.connected && tripId) {
                stompClient.current.publish({
                    destination: `/app/voyage/${tripId}/reserver`,
                    body: JSON.stringify({ placeNumber: seatNumber, status: 'RESERVED' })
                });
            }
        }
    }

    function getSeatClass(seatNumber: number): string {
        const baseClass = "lg:w-12 lg:h-12 w-10 h-10 border-2 rounded-lg transition-all duration-200 ";

        if (permanentOccupiedSeats.includes(seatNumber)) {
            return baseClass + "border-red-600 bg-red-400 cursor-not-allowed opacity-90";
        }

        if (selectedSeats.includes(seatNumber)) {
            return baseClass + "border-green-500 bg-green-300 cursor-pointer hover:bg-green-400";
        }

        if (temporaryReservedSeats.includes(seatNumber)) {
            return baseClass + "border-orange-500 bg-orange-300 cursor-not-allowed";
        }

        return baseClass + "border-gray-400 bg-gray-200 cursor-pointer hover:bg-gray-300";
    }

    return {
        selectedSeats,
        temporaryReservedSeats,
        permanentOccupiedSeats,
        isConnecting,
        isConnected,
        handleSeatClick,
        getSeatClass,
        setSelectedSeats,
        setPermanentOccupiedSeats,
        releaseAllSeats,
        requestInitialState
    };
}