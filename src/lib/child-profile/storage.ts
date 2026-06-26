const KEY = "baldal-child-profile";

export interface ChildProfile {
  birthDate: string;
  updatedAt: string;
}

export function loadChildProfile(): ChildProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChildProfile) : null;
  } catch {
    return null;
  }
}

export function saveChildProfile(profile: Omit<ChildProfile, "updatedAt">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    KEY,
    JSON.stringify({ ...profile, updatedAt: new Date().toISOString() })
  );
}

export function clearChildProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
