<script setup lang="ts">
</script>

<template>
  <ToolTip>
    <div :class="$style.buttonIcon">
        <slot />

    </div>
  </Tooltip>
</template>

<style lang="scss" module>
    .buttonIcon {
        &:hover {
        }
        cursor: pointer;
        background-color: rgba(60,64,67,.08);
        display: flex;
        justify-content: center;
        align-items:center;
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
