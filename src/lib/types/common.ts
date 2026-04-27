import React from "react";

export interface ReactNodeProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export interface TranslationProps {
  t: (key: string) => string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type SupportedLanguage = "en" | "fr";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

export interface SortInterface {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}
