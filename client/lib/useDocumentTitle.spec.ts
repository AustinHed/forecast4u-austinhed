import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("sets the document title on mount", () => {
    renderHook(() => useDocumentTitle("Forecast4U"));

    expect(document.title).toBe("Forecast4U");
  });

  it("updates the document title when it changes", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "First title" },
    });

    expect(document.title).toBe("First title");

    rerender({ title: "Second title" });

    expect(document.title).toBe("Second title");
  });
});
