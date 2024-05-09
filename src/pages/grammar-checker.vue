<script setup lang="ts">
const position = ref({ x: 0, y: 0 });
const display = ref(false);

onMounted(() => {
  document.addEventListener("mousedown", () => {
    display.value = false;
  });

  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      position.value = {
        x: range.getBoundingClientRect().right,
        y: range.getBoundingClientRect().top,
      };
      document.addEventListener("mouseup", () => {
        display.value = true;
      });
    }
  });
});
</script>

<template>
  <h1>grammar-checker</h1>
  <div>
    <b>She is very pretty</b>
  </div>
</template>
