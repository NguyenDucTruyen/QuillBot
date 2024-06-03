<!-- eslint-disable no-console -->
<script setup lang="ts">
let mouseDownedInput: any | null = null
let lastSelectionStart: number = 0
let lastSelectionEnd: number = 0
const boundingBox = ref<HTMLElement | null>(null)
const inputTextarea = ref<HTMLInputElement | null>(null)
function getElement(event: MouseEvent) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    mouseDownedInput = event.target
    console.log('mouseDownedInput:', mouseDownedInput)
  }
}
function handleMouseUp() {
  console.log('handleMouseUp')
  const sel = window.getSelection()
  const selectedText = sel?.toString().trim()
  let boundingClientRect

  if (selectedText) {
    const r = sel?.getRangeAt(0)
    if (mouseDownedInput) {
      const start = mouseDownedInput.selectionStart
      const end = mouseDownedInput.selectionEnd
      lastSelectionStart = start
      lastSelectionEnd = end
      boundingClientRect = getSelectedTextBounding(mouseDownedInput, start, end)
      boundingBox.value!.style.top = `${boundingClientRect.top - 52}px`
      boundingBox.value!.style.left = `${boundingClientRect.right - 210}px`
    }
    else {
      if (r)
        boundingClientRect = r.getBoundingClientRect()
    }
    console.log('boundingClientRect:', boundingClientRect)
  }
  mouseDownedInput = null
}

function getSelectedTextBounding(input: HTMLTextAreaElement | HTMLInputElement, start: number, end: number) {
  const inputBoundRect = input.getBoundingClientRect()
  const div = document.createElement('div')
  div.innerHTML = input.value.replace(/\n/g, '<br />')
  document.body.appendChild(div)

  div.style.position = 'absolute'
  div.style.color = 'green'
  div.style.lineHeight = '20px'
  div.style.left = `${inputBoundRect.left}px`
  div.style.top = `${inputBoundRect.top}px`
  div.style.margin = '0'
  div.style.overflow = 'hidden'
  div.scrollLeft = input.scrollLeft
  div.scrollTop = input.scrollTop
  const range = setSelectionRangeCustom(div, start, end)
  const textBounding = range.getBoundingClientRect()

  reselect()

  document.body.removeChild(div)
  return textBounding
}

function getTextNodesIn(node: Node): Node[] {
  const textNodes = []
  if (node.nodeType === 3) {
    textNodes.push(node)
  }
  else {
    const children = node.childNodes
    for (let i = 0, len = children.length; i < len; ++i)
      textNodes.push(...getTextNodesIn(children[i]))
  }
  return textNodes
}

function setSelectionRangeCustom(el: HTMLElement, start: number, end: number) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const textNodes = getTextNodesIn(el)
  let foundStart = false
  let charCount = 0
  let endCharCount
  for (let i = 0; i < textNodes.length; i++) {
    const textNode = textNodes[i]
    endCharCount = charCount + (textNode.textContent?.length ?? 0)
    if (!foundStart
      && start >= charCount
      && (start < endCharCount
      || (start === endCharCount && i < textNodes.length))
    ) {
      range.setStart(textNode, start - charCount)
      foundStart = true
    }
    if (foundStart && end <= endCharCount) {
      range.setEnd(textNode, end - charCount)
      break
    }
    charCount = endCharCount
  }
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  return range
}
onUnmounted(() => {
  document.removeEventListener('mousedown', () => {})
  document.removeEventListener('mouseup', () => {})
})
function reselect() {
  if (inputTextarea.value) {
    console.log(inputTextarea.value)
    console.log(lastSelectionStart, lastSelectionEnd)
    inputTextarea.value.setSelectionRange(lastSelectionStart, lastSelectionEnd)
  }
}
</script>

<template>
  <div :class="$style.container">
    <h1>Input and Textarea</h1>
    <input
      id="inputTextarea"
      ref="inputTextarea"
      @mousedown="getElement"
      @mouseup="handleMouseUp"
    >
    <div
      ref="boundingBox"
      :style="{
        position: 'absolute',
        width: '20px',
        height: '20px',
        background: 'red',
        top: '0',
        left: '0',
      }"
      @click="reselect"
    />
  </div>
</template>

<style module lang="scss">
.container {
    position: relative;
}
textarea{
    width: 100%;
    height: 200px;
    font-size: 16px;
    outline: none;
    border:none;
    line-height: 20px;
}
input {
    width: 100%;
    font-size: 16px;
    line-height: 20px;
}
</style>
