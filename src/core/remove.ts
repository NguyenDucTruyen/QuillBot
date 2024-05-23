import { setContentEditableSelection } from './set'
import { isInput, isTextArea } from './utils'

interface removeSelectionOptions {
  start: number
  end: number
}

export function removeInputSelection(element: HTMLElement, option: removeSelectionOptions) {
  const el = element as HTMLInputElement
  const value = el.value
  const { start, end } = option
  const newValue = value.slice(0, start) + value.slice(end)
  el.value = newValue
}

export function removeTextAreaSelection(element: HTMLElement, option: removeSelectionOptions) {
  const el = element as HTMLInputElement
  const value = el.value
  const { start, end } = option
  const newValue = value.slice(0, start) + value.slice(end)
  el.value = newValue
}

export function removeContentEditableSelection(element: HTMLElement, option: removeSelectionOptions) {
  setContentEditableSelection(element, {
    start: option.start,
    end: option.end,
    direction: 'forward',
  })

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  range?.deleteContents()
}

export function removeSelectionContent(element: HTMLElement, option: removeSelectionOptions) {
  if (isInput(element))
    removeInputSelection(element, option)
  else if (isTextArea(element))
    removeTextAreaSelection(element, option)
  else
    removeContentEditableSelection(element, option)
}

// export function removeSelection()
