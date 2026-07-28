import { describe, it, expect } from "vitest";
import { normalizeZip } from "./zip";

describe("normalizeZip", () => {
  it("returns the ZIP as-is for a plain five-digit input", () => {
    expect(normalizeZip("12345")).toBe("12345");
  });

  it("returns the five-digit prefix for ZIP+4 input", () => {
    expect(normalizeZip("12345-6789")).toBe("12345");
  });

  it("trims surrounding whitespace before validating", () => {
    expect(normalizeZip("  12345  ")).toBe("12345");
  });

  it("returns null for too few digits", () => {
    expect(normalizeZip("1234")).toBeNull();
  });

  it("returns null for too many digits", () => {
    expect(normalizeZip("123456")).toBeNull();
  });

  it("returns null for a malformed ZIP+4 suffix", () => {
    expect(normalizeZip("12345-678")).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(normalizeZip("abcde")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(normalizeZip("")).toBeNull();
  });
});
