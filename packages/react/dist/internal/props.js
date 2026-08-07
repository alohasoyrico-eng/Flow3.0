export function flowRestProps(props = {}) {
  const {
    contentEditable,
    dangerouslySetInnerHTML,
    style,
    suppressContentEditableWarning,
    suppressHydrationWarning,
    ...rest
  } = props;
  return rest;
}
