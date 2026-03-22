declare module "process/browser.js" {
  const process: typeof globalThis.process;
  export default process;
}
