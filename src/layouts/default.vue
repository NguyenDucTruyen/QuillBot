<script setup lang="ts">
const isExpand = ref(true);
function toggleSidebar() {
  isExpand.value = !isExpand.value;
}
</script>

<template>
  <div :class="$style.default">
    <NavBar :class="$style.defaultHeader" :is-expand="isExpand" @toggle-sidebar="toggleSidebar" />
    <div :class="$style.defaultBody">
      <SideBar
        :is-expand="isExpand"
        :class="[
          $style.defaultBodySideBar,
          isExpand === true && $style.defaultBodySideBarExpand,
        ]"
      />
      <div :class="$style.defaultBodyContainer">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.default {
  display: flex;
  flex-direction: column;
  background-color: #f8fafd;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.defaultHeader {
  height: 52px;
}

.defaultBody {
  display: flex;
  width: 100%;
  height: calc(100% - 52px);
}

.defaultBodySideBar {
  transition: all 0.3s ease;
  width: 50px;
  min-width: 50px;
  background-color: #fff;
  &.defaultBodySideBarExpand {
    min-width: 210px;
  }
}

.defaultBodyContainer {
  width: 100%;
  height: 100%;
  background-color: var(--dt-background);
  overflow: auto;
}
</style>
