<script setup lang="ts">

interface MenuItem {
  name: string
  src: string
  srcDisplay: string
  hoverSrc: string
  isPremium: boolean
}

const menuItems = reactive([
  {
    name: 'History',
    src: '/src/assets/icons/history-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '/src/assets/icons/svgHoverDirection/history-svgrepo-com.svg',
    isPremium: true,
  },
  {
    name: 'Compare Modes',
    src: '/src/assets/icons/photo-compare-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '',
    isPremium: true,
  },
  {
    name: 'Statistics',
    src: '/src/assets/icons/analytics-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '',
    isPremium: false,
  },
  {
    name: 'Tone',
    src: '/src/assets/icons/reaction-emoji-category-02-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '',
    isPremium: true,
  },
  {
    name: 'Setting',
    src: '/src/assets/icons/setting-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '/src/assets/icons/svgHoverDirection/setting-svgrepo-com.svg',
    isPremium: false,
  },
  {
    name: 'Feedback',
    src: '/src/assets/icons/message-square-lines-alt-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc:
      '/src/assets/icons/svgHoverDirection/message-square-lines-alt-svgrepo-com.svg',
    isPremium: false,
  },
  {
    name: 'Hotkeys',
    src: '/src/assets/icons/keyboard-svgrepo-com.svg',
    srcDisplay: '',
    hoverSrc: '/src/assets/icons/svgHoverDirection/keyboard-svgrepo-com.svg',
    isPremium: false,
  },
])

function hover(item: MenuItem, isHovering: boolean) {
  nextTick(() => {
    item.srcDisplay = isHovering ? item.hoverSrc : item.src
  })
}
</script>

<template>
  <div :class="$style.directionMenuContainer">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      :class="$style.directionMenuItem"
    >
      <img
        :class="$style.directionMenuItemImg"
        :src="item.srcDisplay ? item.srcDisplay : item.src"
        @mouseover="hover(item, true)"
        @mouseleave="hover(item, false)"
      >
      <span :class="[item.hoverSrc ? '' : $style.noHoverSrc]">{{
        item.name
      }}</span>
      <div v-if="item.isPremium" :class="$style.directionMenuItemIconPremium">
        <img src="@/assets/icons/diamond-svgrepo-com.svg" alt="Premium">
      </div>
      <div v-if="item.isPremium" :class="$style.tooltipPremium" />
    </div>
  </div>
</template>

<style module lang="scss">
.directionMenuContainer {
  position: absolute;
  right: 12px;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.directionMenuItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  position: relative;
}

.directionMenuItemImg {
  margin: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
}

.directionMenuItem:hover {
  cursor: pointer;
}

.directionMenuItem span {
  font-size: 0.75rem;
  max-width: 3rem;
  text-align: center;
}

.directionMenuItemIconPremium {
  width: 1rem;
  height: 1rem;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 12%;
  top: 30%;
}

.directionMenuItemIconPremium img {
  width: 0.5rem;
  height: 0.5rem;
}

.noHoverSrc {
  color: #c5c6c7;
}
</style>
