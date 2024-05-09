<script setup lang="ts">
defineProps({
  tooltipText: String,
});
</script>

<template>
  <ToolTip>
    <div :class="$style.buttonIcon">
      <slot />
    </div>
  </ToolTip>
</template>

<style lang="scss" module>
.buttonIcon {
  cursor: pointer;
  background-color: rgba(60, 64, 67, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 4px;
}
img {
  width: 24px;
  height: 24px;
}
</style>
