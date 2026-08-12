import { flowTokens } from "../generated/tokens";
import type { FlowTokenName, FlowToken } from "../generated/tokens";

export type PrimitiveTokenResolver<TName extends FlowTokenName> = {
  readonly names: readonly TName[];
  readonly has: (name: FlowTokenName | string) => name is TName;
  readonly get: (name: TName) => FlowToken;
  readonly cssVariable: (name: TName) => `var(--${string})`;
};

export function createPrimitiveTokenResolver<TName extends FlowTokenName>(
  names: readonly TName[],
): PrimitiveTokenResolver<TName> {
  const allowed = new Set<string>(names);
  return {
    names,
    has(name): name is TName {
      return allowed.has(String(name));
    },
    get(name) {
      return flowTokens[name];
    },
    cssVariable(name) {
      return `var(${flowTokens[name].cssVariable})`;
    },
  };
}
