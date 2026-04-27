/**
 * Format une durée ISO 8601 (comme "PT8H30M") en "8:30"
 */
export function formatDurationSimple(isoDuration: string): string {
    const hours = parseInt(isoDuration.match(/(\d+)H/)?.[1] ?? "0", 10);
    const minutes = parseInt(isoDuration.match(/(\d+)M/)?.[1] ?? "0", 10);

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Format une date en heure (ex: "3:45 PM")
 */
export function formatDateToTime(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format une date complète avec l'heure (ex: "June 19, 2025, 3:45 PM")
 */
export function formatFullDateTime(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

/**
 * Format uniquement la date (ex: "June 19, 2025")
 */
export function formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Format une durée en secondes (ex: 5400 => "1h 30min")
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}min`;
    }
}
