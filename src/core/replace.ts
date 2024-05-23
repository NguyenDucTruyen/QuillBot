import { setContentEditableSelection } from './set'
import { isInput, isTextArea } from './utils'

interface ReplaceSelectionOptions {
  text: string
  start: number
  end: number
}

export function replaceInputSelection(element: HTMLElement, option: ReplaceSelectionOptions) {
  const el = element as HTMLInputElement
  const value = el.value
  const { text, start, end } = option
  const newValue = value.slice(0, start) + text + value.slice(end)
  el.value = newValue
}

export function replaceTextAreaSelection(element: HTMLElement, option: ReplaceSelectionOptions) {
  const el = element as HTMLInputElement
  const value = el.value
  const { text, start, end } = option
  const newValue = value.slice(0, start) + text + value.slice(end)
  el.value = newValue
}

export function replaceContentEditableSelection(element: HTMLElement, option: ReplaceSelectionOptions) {
  setContentEditableSelection(element, {
    start: option.start,
    end: option.end,
    direction: 'forward',
  })

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  range?.deleteContents()
  const textNode = document.createTextNode(option.text)
  range?.insertNode(textNode)
}

export function replaceSelection(element: HTMLElement, option: ReplaceSelectionOptions) {
  if(isInput(element))
    replaceInputSelection(element,option)
  else if( isTextArea(element))
    replaceTextAreaSelection(element,option)
  else
    replaceContentEditableSelection(element,option)

}

// export function replaceSelection()
