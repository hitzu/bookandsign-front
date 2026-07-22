import { describe, expect, it } from "vitest";
import {
  getEventPhotoDisplayUrl,
  getSessionPhotoDisplayUrl,
} from "../photoDisplayUrl";

describe("getEventPhotoDisplayUrl", () => {
  it("uses minimizedPublicUrl when present", () => {
    const result = getEventPhotoDisplayUrl({
      publicUrl: "https://cdn.test/original.jpg",
      minimizedPublicUrl: "https://cdn.test/minimized.jpg",
    });

    expect(result).toBe("https://cdn.test/minimized.jpg");
  });

  it("falls back to publicUrl when minimizedPublicUrl is absent", () => {
    const result = getEventPhotoDisplayUrl({
      publicUrl: "https://cdn.test/original.jpg",
    });

    expect(result).toBe("https://cdn.test/original.jpg");
  });

  it("falls back to publicUrl when minimizedPublicUrl is null", () => {
    const result = getEventPhotoDisplayUrl({
      publicUrl: "https://cdn.test/original.jpg",
      minimizedPublicUrl: null,
    });

    expect(result).toBe("https://cdn.test/original.jpg");
  });

  it("falls back to publicUrl when minimizedPublicUrl is an empty string", () => {
    const result = getEventPhotoDisplayUrl({
      publicUrl: "https://cdn.test/original.jpg",
      minimizedPublicUrl: "",
    });

    expect(result).toBe("https://cdn.test/original.jpg");
  });
});

describe("getSessionPhotoDisplayUrl", () => {
  it("uses minimizedUrl when present", () => {
    const result = getSessionPhotoDisplayUrl({
      url: "https://cdn.test/original.jpg",
      minimizedUrl: "https://cdn.test/minimized.jpg",
    });

    expect(result).toBe("https://cdn.test/minimized.jpg");
  });

  it("falls back to url when minimizedUrl is absent", () => {
    const result = getSessionPhotoDisplayUrl({
      url: "https://cdn.test/original.jpg",
    });

    expect(result).toBe("https://cdn.test/original.jpg");
  });
});
