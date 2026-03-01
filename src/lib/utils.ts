import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const FORMATS = [
  { id: "1080x1080", label: "Square 1080×1080", w: 1080, h: 1080 },
  { id: "1440x1800", label: "Portrait 1440×1800", w: 1440, h: 1800 },
  { id: "1440x2560", label: "Stories 1440×2560", w: 1440, h: 2560 },
] as const;

export const LANGUAGES = [
  { id: "da", label: "Dansk (Danish)" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "sv", label: "Svenska" },
  { id: "no", label: "Norsk" },
] as const;

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
