import { isInput, isTextArea } from './utils'

interface SetSelectionOptions {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
}

export function setInputSelection(element: HTMLElement, option: SetSelectionOptions) {
  const el = element as HTMLInputElement
  el.focus()
  el.setSelectionRange(option.start, option.end, option.direction || 'forward')
}

export function setTextAreaSelection(element: HTMLElement, option: SetSelectionOptions) {
  const el = element as HTMLTextAreaElement
  el.focus()
  el.setSelectionRange(option.start, option.end, option.direction || 'forward')
}

export function setContentEditableSelection(element: HTMLElement, option: SetSelectionOptions) {
  let startNode: Node
  let endNode: Node
  let startOffset = 0
  let endOffset = 0
  let charCount = 0
  function traverseNode(node: Node) {
    if (node.nodeType === 3) {
      const nextCharCount = charCount + (node as Text).length

      if (!startNode && option.start >= charCount && option.start <= nextCharCount) {
        startNode = node
        startOffset = option.start - charCount
      }
      if (!endNode && option.end >= charCount && option.end <= nextCharCount) {
        endNode = node
        endOffset = option.end - charCount
      }
      charCount = nextCharCount
    }
    else {
      for (let i = 0; i < node.childNodes.length; i++)
        traverseNode(node.childNodes[i])
    }
    if (!startNode || !endNode)
      return
    const range = document.createRange()
    range.setStart(startNode || element, startOffset)
    range.setEnd(endNode || element, endOffset)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
  traverseNode(element)
}

export function setSelection(element: HTMLElement, option: SetSelectionOptions) {
  if (isInput(element))
    setInputSelection(element, option)
  else if (isTextArea(element))
    setTextAreaSelection(element, option)
  else
    setContentEditableSelection(element, option)
}

