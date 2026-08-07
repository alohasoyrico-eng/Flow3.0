export function flowRestProps(props = {}) {
  const { style, ...rest } = props;
  return rest;
}
