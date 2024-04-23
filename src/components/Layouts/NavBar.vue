<script setup lang="ts">
</script>

<template>
  <div :class="$style.header">
    <div :class="$style.headerSection">
      <button :class="$style.headerIconCollapse">
        <img src="@/assets/icons/Menu.svg" alt="logo">
      </button>
      <div :class="$style.headerLogo">
        <!-- <img src="@/assets/icons/LogoQuillBot.svg" alt="logo"> -->
      </div>
    </div>
    <div :class="$style.headerSection">
      <div :class="$style.headerCenter">
        Paraphraser
      </div>
    </div>
    <div :class="$style.headerSection">
      <div :class="[$style.headerCenter,$style.headerCenterRight]">
        <button :class="$style.headerButtonPremium">
          <img src="@/assets/icons/Diamond.svg" :class="$style.headerButtonPremiumIcon" alt="notification">
          <span :class="$style.headerButtonPremiumText">Upgrade Premium</span>
        </button>
        <div :class="$style.headerLanguage">
          <img src="https://assets.quillbot.com/images/American.svg" :class="$style.headerLanguageIcon" alt="">
        </div>
        <ButtonIcon>
          <img src="@/assets/icons/Moon.svg" alt="notification">
        </ButtonIcon>
        <ButtonIcon>
          <img src="@/assets/icons/User.svg" alt="notification">
        </ButtonIcon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
    .header {
        padding: 0 15px 0 5px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff
    }
    .headerSection {
        height: 100%;
        flex: 1;
        display: flex;
    }
    .headerIconCollapse {
        display: flex;
        color: #444746;
        align-items: center;
        justify-content: center;
        padding: 8px;
        background-color: transparent;
        border: none;

        img {
            width: 24px;
            height: 24px;
            object-fit: contain;
            cursor: pointer;

        }
    }

    .headerCenter {
        display: flex;
        gap:10px;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        color: #252525;
        font-weight: 700;
    }
    .headerButtonPremium {
      padding: 6px 13.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border:none;
      border-radius: 100px;
      height: 36.5px;
      background-color: #499557;
      cursor: pointer;
    }
    .headerButtonPremiumIcon {
      width: 20px;
      height: 18px;
      object-fit: contain;
    }
    .headerButtonPremiumText {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }
    .headerLanguageIcon {
      width: 30px;
      height:30px;
      border-radius: 1000px;
      object-fit: contain;
      cursor:pointer;
    }
    .headerLogo {
        display: flex;
        align-items: center;
    }

    .headerLogoImage {
        width: 44px;
        height: 40px;
        object-fit: contain;
        padding-right: 4px;
        margin-bottom: 4px;
        cursor: pointer;

    }

    .headerLogoName {
        line-height: 44px;
        color: #444746;
        font-size: 22px;
        padding-left: 4px;
        line-height: 24px;
        cursor: pointer;
    }

    .headerCenter {
        flex: 1;
    }

    .headerCenterRight {
        justify-content: flex-end;
    }

    .headerRight {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .el-icon {
        width: 40px;
        height: 40px;
    }

    .headerRightIcon,
    .headerRightAvatar {
        &:hover {
            background-color: rgba(60,64,67,.08);
            cursor: pointer;
        }
        display: flex;
        justify-content: center;
        align-items:center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 4px;
    }
</style>
