const ReactDOM = globalThis.ReactDOM;

if (!ReactDOM) {
  throw new Error("ReactDOM UMD was not loaded");
}

export const createRoot = ReactDOM.createRoot;
export default { createRoot };
