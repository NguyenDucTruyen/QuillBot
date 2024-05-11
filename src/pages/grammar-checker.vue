<script setup lang="ts">
type visibileStatus = 'initial' | 'tooltip' | 'popup'
const position = ref({ x: 0, y: 0 })
const status = ref<visibileStatus>('initial')
const answer = ref('Đây là nội dung để tui test thôi ngheeeeeeeeeeeeeeee')
const ouput = ref(null)
const tooltip = ref()
const popup = ref()

let sel: Selection | null = null
onMounted(() => {
  document.addEventListener('selectionchange', () => {
    sel = window.getSelection()
    console.log('selectionchange')
    if (!sel?.rangeCount || sel?.toString()?.length === 0)
      return

    const range = sel.getRangeAt(0)
    position.value = {
      x: range.getBoundingClientRect().right,
      y: range.getBoundingClientRect().top,
    }
  })
})

function handleMouseUP() {
  console.log('tooltipp')
  if (!sel?.anchorNode || !sel?.focusNode)
    return
  status.value = 'tooltip'
}
function handleBlur() {
  

  if (!sel?.anchorNode || !sel?.focusNode)
    return
  const range = document.createRange()
  range.setStart(sel?.anchorNode, sel?.anchorOffset)
  range.setEnd(sel?.focusNode, sel?.focusOffset)
  sel.removeAllRanges()
  window.getSelection()?.addRange(range)
  status.value = 'popup'
}
</script>

<template>
  <h1>grammar-checker</h1>
  <div>
    <div
      ref="ouput"
      contenteditable
      :style="{
        minHeight: '200px',
        maxWidth: '400px',
        background: '#ccc',
      }"
      @mouseup="handleMouseUP"
      @blur="handleBlur"
    >
      {{ answer }}
    </div>
    <div
      v-if="status === 'tooltip'"
      ref="tooltip"
      :style="{
        position: 'fixed',
        background: 'red',
        width: '20px',
        height: '20px',
        top: `${position.y + 4}px`,
        left: `${position.x}px`,
      }"
    />
    <div
      v-else-if="status === 'popup'"
      ref="popup"
      :style="{
        position: 'fixed',
        background: 'brown',
        width: '100px',
        height: '100px',
        top: `${position.y + 4}px`,
        left: `${position.x}px`,
      }"
    />
  </div>
</template>
