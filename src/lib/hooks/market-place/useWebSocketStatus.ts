import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocketStatus(tripId?: string) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const stompClient = useRef<any>(null);
    const connectionRetries = useRef(0);
    const maxRetries = 3;

    useEffect(() => {
        if (!tripId) {
            setIsConnecting(false);
            setIsConnected(false);
            return;
        }

        setIsConnecting(true);
        setIsConnected(false);

        const connectWebSocket = () => {
            const client = new Client({
                webSocketFactory: () => new SockJS("https://agence-voyage.ddns.net/api/ws"),
                onConnect: () => {
                    setIsConnected(true);
                    setIsConnecting(false);
                    connectionRetries.current = 0;
                },
                onStompError: (error) => {
                    console.error('WebSocket status error:', error);
                    setIsConnected(false);
                    setIsConnecting(false);
                    handleReconnection();
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket status connection error:', error);
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
                setIsConnecting(false);
            }
        };

        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [tripId]);

    return {
        isConnecting,
        isConnected
    };
}