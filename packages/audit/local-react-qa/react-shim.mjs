const React = globalThis.React;

if (!React) {
  throw new Error("React UMD was not loaded");
}

export default React;
export const Children = React.Children;
export const Fragment = React.Fragment;
export const StrictMode = React.StrictMode;
export const cloneElement = React.cloneElement;
export const createContext = React.createContext;
export const createElement = React.createElement;
export const forwardRef = React.forwardRef;
export const isValidElement = React.isValidElement;
export const memo = React.memo;
export const useCallback = React.useCallback;
export const useEffect = React.useEffect;
export const useId = React.useId;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useState = React.useState;
