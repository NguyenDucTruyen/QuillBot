<script setup lang="ts">
</script>

<template>
  <div :class="$style.directionMenuContainer">
    <div :class="$style.directionMenuContainerChild">
      <div
        :class="[$style.directionMenuItem, $style.directionMenuItemAbleToHover]"
      >
        <img
          :class="[$style.directionMenuItemImg]"
          src="@/assets/icons/history-svgrepo-com.svg"
        >
        <img
          :class="$style.directionMenuItemImgHover"
          src="@/assets/icons/svgHoverDirection/history-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">History</span>
        <div :class="$style.directionMenuItemIconPremium">
          <img src="@/assets/icons/diamond-svgrepo-com.svg" alt="Premium">
        </div>
      </div>
      <div
        :class="$style.directionMenuItem"
      >
        <img
          :class="$style.directionMenuItemImg"
          src="@/assets/icons/photo-compare-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Compare Modes</span>
        <div :class="$style.directionMenuItemIconPremium">
          <img src="@/assets/icons/diamond-svgrepo-com.svg" alt="Premium">
        </div>
      </div>
      <div
        :class="$style.directionMenuItem"
      >
        <img
          :class="$style.directionMenuItemImg"
          src="@/assets/icons/analytics-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Statistics</span>
      </div>
      <div
        :class="$style.directionMenuItem"
      >
        <img
          :class="$style.directionMenuItemImg"
          src="@/assets/icons/reaction-emoji-category-02-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Tone</span>
        <div :class="$style.directionMenuItemIconPremium">
          <img src="@/assets/icons/diamond-svgrepo-com.svg" alt="Premium">
        </div>
      </div>
    </div>
    <div :class="$style.directionMenuContainerChild">
      <div
        :class="[$style.directionMenuItem, $style.directionMenuItemAbleToHover]"
      >
        <img
          :class="[$style.directionMenuItemImg]"
          src="@/assets/icons/setting-svgrepo-com.svg"
        >
        <img
          :class="$style.directionMenuItemImgHover"
          src="@/assets/icons/svgHoverDirection/setting-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Setting</span>
      </div>
      <div
        :class="[$style.directionMenuItem, $style.directionMenuItemAbleToHover]"
      >
        <img
          :class="[$style.directionMenuItemImg]"
          src="@/assets/icons/message-square-lines-alt-svgrepo-com.svg"
        >
        <img
          :class="$style.directionMenuItemImgHover"
          src="@/assets/icons/svgHoverDirection/message-square-lines-alt-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Feedback</span>
      </div>
      <div
        :class="[$style.directionMenuItem, $style.directionMenuItemAbleToHover]"
      >
        <img
          :class="[$style.directionMenuItemImg]"
          src="@/assets/icons/keyboard-svgrepo-com.svg"
        >
        <img
          :class="$style.directionMenuItemImgHover"
          src="@/assets/icons/svgHoverDirection/keyboard-svgrepo-com.svg"
        >
        <span :class="$style.noHoverSr">Hotkeys</span>
      </div>
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
  min-height: 70%;
  justify-content: space-between;
}
.directionMenuContainerChild {
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
  cursor: pointer;
  color: #c5c6c7;
}
.directionMenuItemAbleToHover {
  color: var(--color-gray-darker);
}
.directionMenuItemImg {
  margin: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
}
.directionMenuItemImgHover {
  margin: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  display: none;

}

.directionMenuItemAbleToHover:hover {
  .directionMenuItemImg{
    display: none;
  }
  .directionMenuItemImgHover {
    display: block;
  }
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
</style>
