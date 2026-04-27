import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Vérifier si la route nécessite une authentification
    if (request.nextUrl.pathname.startsWith('/user-connected')) {

        // Vérifier le token d'authentification (adapter selon votre système)
        const token = request.cookies.get('auth-token')?.value;
        const sessionId = request.cookies.get('session-id')?.value;

        // Si pas connecté, rediriger vers une page avec modal d'auth
        if (!token && !sessionId) {
            const loginUrl = new URL('/auth-required', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}