import { Buffer } from "buffer/";
import process from "process/browser.js";

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer as typeof globalThis.Buffer;
}

if (!globalThis.process) {
  globalThis.process = process;
}

if (!globalThis.global) {
  globalThis.global = globalThis;
}
