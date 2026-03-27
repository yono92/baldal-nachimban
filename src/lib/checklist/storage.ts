const STORAGE_KEY = "baldal-checklist";

export interface ChecklistStorage {
  birthDate: string;
  updatedAt: string;
  checked: Record<string, boolean>;
}

export function loadChecklist(): ChecklistStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChecklistStorage;
  } catch {
    return null;
  }
}

export function saveChecklist(data: ChecklistStorage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
}

export function clearChecklist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
