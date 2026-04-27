// src/lib/types/calendar.ts
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  /**
   * Statut du voyage. Typé `string` pour accepter toutes les valeurs envoyées
   * par le backend (PUBLIE, EN_COURS, EN_ATTENTE, TERMINE, ANNULE...).
   * Utiliser une union restreinte créerait des assertions partout côté hooks.
   */
  status: string;
  description?: string;
  location?: string;
  price?: number;
  availableSeats?: number;
  totalSeats?: number;
}

export interface CalendarView {
  type: "month" | "week" | "day" | "agenda";
  current: Date;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
  weeks: CalendarDay[][];
}

export interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange?: (view: "month" | "week" | "day") => void;
  currentView?: "month" | "week" | "day";
}

export interface DayDetailProps {
  date: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onCreateEvent: (date: Date) => void;
  onBack: () => void;
}
