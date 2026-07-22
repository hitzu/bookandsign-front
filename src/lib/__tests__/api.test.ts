import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEvent } from "../api";

const jsonResponse = (data: unknown, status = 200) => ({
  status,
  ok: status >= 200 && status < 300,
  headers: { get: () => "application/json" },
  json: async () => data,
});

describe("fetchEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps minimizedPublicUrl when the backend provides it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          event: { id: "1", name: "Boda" },
          photos: [
            {
              id: 1,
              publicUrl: "https://cdn.test/original.jpg",
              minimizedPublicUrl: "https://cdn.test/minimized.jpg",
              createdAt: "2026-01-01",
            },
          ],
        }),
      ),
    );

    const result = await fetchEvent("tok123");

    expect(result.photos[0].minimizedPublicUrl).toBe(
      "https://cdn.test/minimized.jpg",
    );
    expect(result.photos[0].publicUrl).toBe("https://cdn.test/original.jpg");
  });

  it("never drops a photo when minimizedPublicUrl is absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          event: { id: "1", name: "Boda" },
          photos: [
            {
              id: 2,
              publicUrl: "https://cdn.test/only-original.jpg",
              createdAt: "2026-01-02",
            },
          ],
        }),
      ),
    );

    const result = await fetchEvent("tok123");

    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].minimizedPublicUrl).toBeNull();
    expect(result.photos[0].publicUrl).toBe(
      "https://cdn.test/only-original.jpg",
    );
  });
});
