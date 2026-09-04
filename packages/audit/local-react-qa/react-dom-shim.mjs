const ReactDOM = globalThis.ReactDOM;

if (!ReactDOM) {
  throw new Error("ReactDOM UMD was not loaded");
}

export const createPortal = ReactDOM.createPortal;
export default ReactDOM;
