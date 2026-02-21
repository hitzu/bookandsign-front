const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
);

type ApiRequestOptions = RequestInit & {
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const buildApiUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiGet = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { signal, headers, ...rest } = options;
  const response = await fetch(buildApiUrl(path), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(headers || {}),
    },
    signal,
    ...rest,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as T;
};
/**
 * Party event API. Uses NEXT_PUBLIC_API_BASE_URL (fallback: NEXT_PUBLIC_API_URL).
 * No Supabase from frontend.
 */

/** Use proxy path to avoid CORS when frontend and backend are different origins */
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000"
  );
};

export interface EventData {
  id: string;
  name: string;
  description?: string;
}

export interface EventPhoto {
  id: string;
  publicUrl: string;
  createdAt?: string;
}

export interface FetchEventResponse {
  event: EventData | null;
  photos: EventPhoto[];
}

/**
 * Fetches event + photos by token.
 */
export async function fetchEvent(
  token: string,
  signal?: AbortSignal
): Promise<FetchEventResponse> {
  const base = getBaseUrl();
  const url = `${base}/photos/event/${encodeURIComponent(token)}`;

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return { event: null, photos: [] };
  }

  if (!res.ok) {
    throw new Error(`Event API error: ${res.status}`);
  }

  const data = (await res.json()) as unknown;

  // Backend puede devolver { event, photos } o directamente array de fotos
  const rawArray = Array.isArray(data) ? data : (data as { photos?: unknown[] })?.photos;
  const rawEvent = Array.isArray(data) ? null : (data as { event?: unknown })?.event;

  const photos: EventPhoto[] = (rawArray ?? []).map((p: Record<string, unknown>) => ({
    id: String(p.id ?? ""),
    publicUrl: String(p.publicUrl ?? ""),
    createdAt: p.createdAt as string | undefined,
  }));

  const event: EventData | null =
    rawEvent && typeof rawEvent === "object" && rawEvent !== null
      ? {
          id: String((rawEvent as Record<string, unknown>).id ?? ""),
          name: String((rawEvent as Record<string, unknown>).name ?? "Tus fotos"),
          description: (rawEvent as Record<string, unknown>).description as string | undefined,
        }
      : photos.length > 0
        ? { id: token, name: "Tus fotos", description: "" }
        : null;

  return { event, photos };
}
