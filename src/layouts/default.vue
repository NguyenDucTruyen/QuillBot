<script setup lang="ts">

</script>

<template>
  <div :class="$style.default">
    <NavBar :class="$style.defaultHeader" />
    <div :class="$style.defaultBody">
      <SideBar :class="$style.defaultBodySideBar"/>
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
    background-color: #F8FAFD;
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
    height: calc(100% - 64px);
  }

  .defaultBodySideBar {
    min-width: 210px;
    background-color: #fff;
  }

  .defaultBodyContainer {
    width: 100%; 
    border-radius: 14px;
    background-color: var(--dt-background);
  }
</style>
