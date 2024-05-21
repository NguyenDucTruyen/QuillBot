<script setup lang="ts">
let mouseDownedInput: any | null = null
let lastSelectionStart: number = 0
let lastSelectionEnd: number = 0
onMounted(() => {
  document.addEventListener('mousedown', (event) => {
    if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA')
      mouseDownedInput = event.target as HTMLElement
  })

  document.addEventListener('mouseup', (e) => {
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
        console.log(boundingClientRect)
      }
      else {
        if (r)
          boundingClientRect = r.getBoundingClientRect()
      }
    }
    mouseDownedInput = null
  })

  document.addEventListener('click', (_) => {
    if (lastSelectionStart !== null && lastSelectionEnd !== null) {
      const input = document.getElementById('inputTextarea')
      if (input)
        input.setSelectionRange(lastSelectionStart, lastSelectionEnd)
    }
  })

  function getSelectedTextBounding(input, start, end) {
    const inputBoundRect = input.getBoundingClientRect()
    const div = document.createElement('div')
    div.innerHTML = input.value.replace(/\n/g, '<br />')
    document.body.appendChild(div)
    div.style.cssText = window.getComputedStyle(input, null).cssText
    div.style.position = 'absolute'
    div.style.left = `${inputBoundRect.left}px`
    div.style.top = `${inputBoundRect.top}px`
    div.style.margin = '0'
    div.style.overflow = 'hidden'
    div.scrollLeft = input.scrollLeft
    div.scrollTop = input.scrollTop
    const range = setSelectionRange(div, start, end)
    const textBounding = range.getBoundingClientRect()

    const inputArea = document.getElementById('inputTextarea')
    setSelectionRange(inputArea as HTMLElement, lastSelectionStart, lastSelectionEnd)

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

  function setSelectionRange(el:HTMLElement, start:number, end) {
    const range = document.createRange()
    range.selectNodeContents(el)
    const textNodes = getTextNodesIn(el)
    let foundStart = false; let charCount = 0; let endCharCount
    for (const textNode of textNodes) {
      endCharCount = charCount + textNode.length
      if (!foundStart && start >= charCount && (start < endCharCount || (start === endCharCount && i < textNodes.length))) {
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
    sel.removeAllRanges()
    sel.addRange(range)
    return range
  }
})
</script>

<template>
  <h1>Select Text in the Textarea</h1>
  <textarea id="inputTextarea">This is some sample text. Select a part of this text to see the bounding box in the console.</textarea>
</template>

<style module lang="scss">
  textarea {
    width: 100%;
    height: 200px;
  }
</style>
