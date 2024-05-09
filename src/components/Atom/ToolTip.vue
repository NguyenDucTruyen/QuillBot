<script lang="ts" setup>
export interface Props {
  tooltipText: string;
  position: "top" | "left" | "bottom" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  tooltipText: "",
  position: "left",
});

const { tooltipText, position } = toRefs(props);
const showTooltip = ref(true);

function show() {
  showTooltip.value = true;
}

function hide() {
  showTooltip.value = false;
}

onMounted(() => {
  const el = document.querySelector(".tooltip");
  if (el) {
    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
  }
});

onBeforeUnmount(() => {
  const el = document.querySelector(".tooltip");
  if (el) {
    el.removeEventListener("mouseenter", show);
    el.removeEventListener("mouseleave", hide);
  }
});
</script>

<template>
  <div :class="$style.tooltip">
    <slot />
    <div
      v-if="tooltipText.trim()"
      :class="[$style.tooltipContent, $style[`position${position}`]]"
    >
      {{ tooltipText }}
    </div>
  </div>
</template>

<style lang="scss" module>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltipContent {
  position: absolute;
  background-color: #333;
  color: #dcdcdc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.2s,
    visibility 0.2s;
}

.tooltipContent::after {
  content: "";
  position: absolute;
  border-width: 5px;
  border-style: solid;
}

.tooltip:hover .tooltipContent {
  visibility: visible;
  opacity: 1;
}

.positiontop {
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
}

.positiontop::after {
  border-color: #333 transparent transparent transparent;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.positionleft {
  top: 50%;
  right: calc(100% + 8px);
  transform: translateY(-50%);
}

.positionleft::after {
  border-color: transparent transparent transparent #333;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
}

.positionbottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.positionbottom::after {
  border-color: transparent transparent #333 transparent;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.positionright {
  top: 50%;
  left: calc(100% + 8px);
  transform: translateY(-50%);
}
.positionright::after {
  border-color: transparent #333 transparent transparent;
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
}
</style>
