import { isInput, isTextArea } from './utils'

interface GetSelectionResult {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
  text: string
}

export function getInputSelection(element: HTMLElement) {
  const inputEl = element as HTMLInputElement

  const result = {
    start: inputEl.selectionStart,
    end: inputEl.selectionEnd,
    direction: inputEl.selectionDirection as 'forward' | 'backward' | 'none',
    text: inputEl.value.slice(inputEl.selectionStart || 0, inputEl.selectionEnd || 0),
  }
  return result as GetSelectionResult
}

export function getTextAreaSelection(element: HTMLElement) {
  const textareaEl = element as HTMLTextAreaElement
  const result = {
    start: textareaEl.selectionStart,
    end: textareaEl.selectionEnd,
    direction: textareaEl.selectionDirection as 'forward' | 'backward' | 'none',
    text: textareaEl.value.slice(textareaEl.selectionStart || 0, textareaEl.selectionEnd || 0),
  }
  return result as GetSelectionResult
}

export function getContentEditableSelection(element: HTMLElement) {
  const contentEditable = element as HTMLElement
  const selection = window.getSelection()

  const range = selection?.getRangeAt(0)
  if (!range)
    return

  const rangeClone = range?.cloneRange()
  rangeClone?.selectNodeContents(contentEditable)
  rangeClone?.setEnd(range?.startContainer, range?.startOffset)
  // Get start position
  const start = rangeClone?.toString().length || 0
  rangeClone?.setEnd(range?.endContainer, range?.endOffset)

  // Get end position
  const end = rangeClone?.toString().length || 0
  const div = document.createElement('div')
  div.appendChild(range.cloneContents())

  const result = {
    start,
    end,
    direction: 'forward',
    text: div.innerHTML || range.toString() || div.textContent || '',
  }

  return result as GetSelectionResult
}

export function getSelection(element: HTMLElement) {
  if (isInput(element))
    return getInputSelection(element)

  else if (isTextArea(element))
    return getTextAreaSelection(element)

  else
    return getContentEditableSelection(element)
}
