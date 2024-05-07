<script setup lang="ts">
import { Icon } from '@iconify/vue'
import OpenAi from '@/api/generateAI.ts'

interface MenuItem {
  name: string
  src: string
  srcDisplay: string
  hoverSrc: string
  isPremium: boolean
}
const languageList = [
  {
    id: 1,
    name: 'English (US)',
    code: 'en',
  },
  {
    id: 2,
    name: 'Spanish',
    code: 'es',
  },
  {
    id: 3,
    name: 'French',
    code: 'fr',
  },
  {
    id: 4,
    name: 'German',
    code: 'de',
  },
  {
    id: 5,
    name: 'Italian',
    code: 'it',
  },
]
const currentLanguage = ref('en')

const listModes = [
  {
    id: 1,
    name: 'Standard',
    code: 'standard',

  },
  {
    id: 2,
    name: 'Fluency',
    code: 'fluency',
    languages: [
      'en',
    ],
  },
  {
    id: 3,
    name: 'Natural',
    code: 'natural',
    languages: [
      'en',
    ],
  },
  {
    id: 4,
    name: 'Formal',
    code: 'formal',
    languages: [
      'en',
    ],
  },
  {
    id: 5,
    name: 'Academic',
    code: 'academic',
    languages: [
      'en',
    ],
  },
  {
    id: 6,
    name: 'Simple',
    code: 'simple',
    languages: [
      'en',
    ],
  },
  {
    id: 7,
    name: 'Creative',
    code: 'creative',
    languages: [
      'en',
    ],
  },
  {
    id: 8,
    name: 'Expand',
    code: 'expand',
    languages: [
      'en',
    ],
  },
]
const currentMode = ref('standard')

const inputArea = ref()
const outputArea = ref()
const container = ref()
const inputFile = ref()
const textInput = ref('')
const answer = ref('')
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
    hoverSrc: '/src/assets/icons/svgHoverDirection/message-square-lines-alt-svgrepo-com.svg',
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

async function fetchAnswer() {
  answer.value = ''
  try {
    answer.value = await OpenAi.getParaphraseFullContent(textInput.value.trim())
  }
  catch (error) {
  }
  finally {
    // isLoading.value = false
  }
}

function hover(item: MenuItem, isHovering: boolean) {
  nextTick(() => {
    item.srcDisplay = isHovering ? item.hoverSrc : item.src
  })
}
function countWords(text: string): number {
  return text.split(' ').filter(word => word !== '').length
}
function uploadFile() {
  inputFile.value.click()
}
function handleUploadFile() {

}
function handleCurrentLanguage(code: string) {
  currentLanguage.value = code
  currentMode.value = 'standard'
}
function mouseMoveHandler(event: MouseEvent) {
  const leftWidth = event.clientX - container.value.getBoundingClientRect().left
  if (inputArea.value)
    inputArea.value.style.width = `${leftWidth}px`
  outputArea.value.style.width = `calc(100% - ${leftWidth}px)`
}
function mouseUpHandler() {
  document.removeEventListener('mousemove', mouseMoveHandler)
}
function handleDrag() {
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}
function clearText() {
  textInput.value = ''
}
</script>

<template>
  <div :class=" $style.paragrapher ">
    <div :class=" $style.paragrapherForm ">
      <div :class=" $style.paragrapherHeader ">
        <div
          v-for="item in languageList" :key=" item.id "
          :class=" [$style.paragrapherHeaderLanguage, currentLanguage === item.code && $style.paragrapherHeaderLanguageActive] "
          @click="handleCurrentLanguage(item.code)"
        >
          {{ item.name }}
        </div>
      </div>
      <div :class=" $style.paragrapherModes ">
        <div :class=" $style.paragrapherModesTitle ">
          Modes:
        </div>
        <div v-for="item in listModes" :key=" item.id " div>
          <div
            v-if="item.code === 'standard' || item?.languages?.includes(currentLanguage)"
            :class=" [$style.paragrapherModesLanguage, currentMode === item.code && $style.paragrapherModesLanguageActive] "
            @click="currentMode = item.code"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div ref="container" :class=" $style.paragrapherContainer ">
        <div ref="inputArea" :class=" $style.paragrapherContainerLeft ">
          <Icon
            v-if="textInput.trim()" icon="mdi:trash-outline" :class=" $style.paragrapherIconDelete "
            @click=" clearText "
          />
          <textarea
          v-model=" textInput "
            :class=" $style.paragrapherContainerTextarea " placeholder="To rewrite text, enter or paste here and press 'Paraphrase'"
          />
          <div :class=" $style.paragrapherContainerLeftFooter ">
            <div v-if="!textInput.trim()" :class=" $style.paragrapherContainerLeftUpload " @click=" uploadFile ">
              <input
                ref="inputFile" type="file" name="inputFile" :class=" $style.inputFile " accept=".docx"
                @input=" handleUploadFile "
              >
              <Icon icon="icons8:upload-2" style="color: #5f6368" />
              <span :class=" $style.paragrapherContainerLeftUploadText ">Upload Doc</span>
            </div>
            <div v-else :class=" $style.paragrapherContainerLeftUpload ">
              <span :class=" $style.paragrapherContainerLeftCountWords ">{{ countWords(textInput) }} words</span>
            </div>
            <button type="button" :class=" $style.paragrapherContainerLeftButtonSubmit " @click="fetchAnswer">
              Paraphrase
            </button>
          </div>
        </div>
        <div :draggable=" false " :class=" $style.paragrapherContainerCenter " @mousedown=" handleDrag ">
          <div />
        </div>
        <div ref="outputArea" :class=" $style.paragrapherContainerRight ">
          <span :class=" $style.paragrapherContainerTextarea ">{{ answer }}</span>
        </div>
      </div>
    </div>
    <div :class=" $style.directionMenuContainer ">
      <div v-for="(item, index) in menuItems" :key=" index " :class=" $style.directionMenuItem ">
        <img
          :class=" $style.directionMenuItemImg " :src=" item.srcDisplay ? item.srcDisplay : item.src "
          @mouseover="hover(item, true)" @mouseleave="hover(item, false)"
        >
        <span :class=" [item.hoverSrc ? '' : $style.noHoverSrc] ">{{ item.name }}</span>
        <div v-if="item.isPremium" :class=" $style.directionMenuItemIconPremium ">
          <img src="@/assets/icons/diamond-svgrepo-com.svg" alt="Premium">
        </div>
        <div v-if="item.isPremium" :class=" $style.tooltipPremium " />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.paragrapher {
  padding: 25px 100px 40px 44px;
  width: 100%;
  color: #505050;
  position: relative;

}

.paragrapherHeader {
  display: flex;
}

.paragrapherHeaderLanguage {
  display: flex;
  padding: 8px 16px;
  border-radius: 8px 8px 0px 0px;
  cursor: pointer;
  // @include text-style(14px,400,20px,#505050);
  font-size: 14px;
  color: #505050;
  font-weight: 400;
  line-height: 20px;
}

.paragrapherHeaderLanguageActive {
  background-color: #ffffff;
  font-weight: 500;
}

.paragrapherModes {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  background-color: #ffffff;
}

.paragrapherModesTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #505050;
  padding: 13px 12px 12px 20px;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
}

.paragrapherModesLanguage {
  height: 100%;
  display: flex;
  padding: 13px 9px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #505050;
}

.paragrapherModesLanguageActive {
  color: var(--color-green);
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 1px;
    left: 0;
    background-color: var(--color-green);
  }
}

.paragrapherContainer {
  display: flex;
  width: 100%;
  background: #fff;
  min-height: 400px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 20px 0px;
}

.paragrapherContainerTextarea {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  padding: 20px 36px 8px 20px;
  font-size: 16px;
  line-height: 1.5;
  color: #505050;
  font-weight: 400;
  outline: none;
}

.paragrapherContainerLeft {
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px);
  max-width: 70%;
  min-width: 300px;
  position: relative;
}

.paragrapherIconDelete {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 18px;
  width: 24px;
  height: 24px;
}

.inputFile {
  display: none;
}

.paragrapherContainerLeftFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  height: 54px;
}

.paragrapherContainerLeftUpload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-left: 15px;
  font-size: 23px;
  cursor: pointer;
}

.paragrapherContainerLeftUploadText {
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
}

.paragrapherContainerLeftCountWords {
  font-size: 14px;
  line-height: 20px;
}

.paragrapherContainerLeftButtonSubmit {
  padding: 5px 25px 6px;
  font-size: 17px;
  color: #fff;
  font-weight: bold;
  border-radius: 25px;
  text-transform: capitalize;
  position: relative;
  width: 140px;
  min-height: 40px;
  background-color: #499557;
  border: none;
}

.paragrapherContainerCenter {
  width: 10px;
  border-left: 3px solid #44474663;
  cursor: e-resize;

  &:hover {
    border-left-width: 7px;
  }
}

.paragrapherContainerRight {
  display: flex;
  width: calc(50% - 10px);
  max-width: 70%;
  min-width: 300px;
}

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
  color: #C5C6C7;
}
</style>
