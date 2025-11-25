import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { config } from "dotenv";
import { jest } from "@jest/globals";

config({ path: ".env.local" });

if (!global.TextEncoder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).TextDecoder =
    TextDecoder as unknown as typeof global.TextDecoder;
}

// Fix for MUI X Charts structuredClone usage
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).jest = jest;
