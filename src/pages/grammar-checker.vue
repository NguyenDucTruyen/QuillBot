<script setup lang="ts">
import { getSelection } from '@/core/get'
import { setSelection } from '@/core/set'

const textarea = ref<HTMLTextAreaElement | null>(null)
const contentEditable = ref<HTMLElement | null>(null)
let selection: any | null = null
function getSelectionMouseup(element: HTMLElement | null) {
  if (element) {
    selection = getSelection(element)
    selection.element = element
  }
}
function setSelectionnn() {
  if (!selection)
    return
  const setSelectionOption = {
    start: selection.start,
    end: selection.end,
    direction: selection.direction,
  }
  setSelection(selection.element as HTMLElement, setSelectionOption)
}
</script>

<template>
  <h1>grammar-checker</h1>
  <textarea
    id=""
    ref="textarea" name=""
    @mouseup="getSelectionMouseup(textarea)"
  >
    Hello tất cả mọi người
  </textarea>
  <div
    ref="contentEditable"
    contenteditable
    @mouseup="getSelectionMouseup(contentEditable)"
  >
    Hello <b>World</b>
  </div>
  <button @click="setSelectionnn">
    click me
  </button>
</template>

<style lang="scss" module>
  textarea {
    width: 100%;
    height: 200px;
    resize: none;
    }
</style>
