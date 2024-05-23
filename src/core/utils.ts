export function isInput(element: HTMLElement) {
  return element.tagName === 'INPUT'
}
export function isTextArea(element: HTMLElement) {
  return element.tagName === 'TEXTAREA'
}
export function isInputOrTextArea(element: HTMLElement) {
  return isInput(element) || isTextArea(element)
}
