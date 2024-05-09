<script lang="ts" setup>
const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<template>
  <div :class="$style.baseModal" @submit.stop.prevent @click="close">
    <slot name="header" />
    <div :class="$style.baseModalBody">
      <slot />
    </div>
  </div>
  <div :class="$style.modalFooter">
    <slot name="footer" />
  </div>
</template>

<style lang="scss" module>
.baseModal {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--dt-scrim);
}

.baseModalBody {
  overflow-y: auto;
  max-height: 100%;
}

.modalFooter {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
