import { describe, expect, it } from "vitest";
import { PACKAGE_NAME, PACKAGE_VERSION } from "./index.js";

describe("package metadata", () => {
  it("exposes the scoped package name", () => {
    expect(PACKAGE_NAME).toBe("@weacademy/bytechain-shared");
  });

  it("exposes a semver version", () => {
    expect(PACKAGE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
