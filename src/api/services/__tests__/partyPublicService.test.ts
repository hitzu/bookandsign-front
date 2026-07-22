import { describe, expect, it, vi } from "vitest";

vi.mock("../../config/axiosConfig", () => ({
  axiosInstanceWithoutToken: {
    get: vi.fn(),
  },
}));

import { axiosInstanceWithoutToken } from "../../config/axiosConfig";
import { getEventPhotosPage } from "../partyPublicService";

const mockedGet = axiosInstanceWithoutToken.get as unknown as ReturnType<
  typeof vi.fn
>;

describe("getEventPhotosPage", () => {
  it("never drops a photo when minimizedPublicUrl is absent (approval test — pass-through by design)", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 1,
            storagePath: "a.jpg",
            publicUrl: "https://cdn.test/a.jpg",
            minimizedPublicUrl: "https://cdn.test/a-min.jpg",
            consentAt: "2026-01-01",
            createdAt: "2026-01-01",
          },
          {
            id: 2,
            storagePath: "b.jpg",
            publicUrl: "https://cdn.test/b.jpg",
            consentAt: "2026-01-01",
            createdAt: "2026-01-01",
          },
        ],
        hasMore: false,
        nextCursor: null,
      },
    });

    const result = await getEventPhotosPage("tok123");

    expect(result.items).toHaveLength(2);
    expect(result.items[0].minimizedPublicUrl).toBe(
      "https://cdn.test/a-min.jpg",
    );
    expect(result.items[0].publicUrl).toBe("https://cdn.test/a.jpg");
    expect(result.items[1].minimizedPublicUrl).toBeUndefined();
    expect(result.items[1].publicUrl).toBe("https://cdn.test/b.jpg");
  });
});
