<script setup lang="ts">
import { Icon } from '@iconify/vue'
// import OpenAi from '@/api/generateAI.ts'
import { computePosition, flip, inline, offset } from '@floating-ui/dom'
import gemini from '@/api/generateParaphrase.ts'

interface ItemParaphraseText {
  id: number
  content: string
}
type popOverStatus = 'initial' | 'tooltip' | 'popOver'

const languageList = [
  {
    id: 1,
    name: 'English (US)',
    code: 'en',
  },
  {
    id: 2,
    name: 'Vietnamese',
    code: 'vi',
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
    languages: ['en', 'vi'],
  },
  {
    id: 3,
    name: 'Natural',
    code: 'natural',
    languages: ['en', 'vi'],
  },
  {
    id: 4,
    name: 'Formal',
    code: 'formal',
    languages: ['en', 'vi'],
  },
  {
    id: 5,
    name: 'Academic',
    code: 'academic',
    languages: ['en', 'vi'],
  },
  {
    id: 6,
    name: 'Simple',
    code: 'simple',
    languages: ['en'],
  },
  {
    id: 7,
    name: 'Creative',
    code: 'creative',
    languages: ['en', 'vi'],
  },
  {
    id: 8,
    name: 'Expand',
    code: 'expand',
    languages: ['en', 'vi'],
  },
]

const currentMode = ref('standard')
const isLoading = ref(false)
const inputArea = ref()
const outputArea = ref()
const container = ref()
const inputFile = ref()
const textInput = ref('')
const contentParaphrase = ref('')
const answer = ref('')
const paraphraseText = ref({
  current: {} as ItemParaphraseText,
  history: [] as ItemParaphraseText[],
})
const childRect = ref<Array<DOMRect>>([])
const rect = ref(new DOMRect())
const virtualElement = ref({
  getBoundingClientRect: () => rect.value,
  getClientRects: () => [childRect.value[childRect.value.length - 1]],
})
const outPutText = ref()
const status = ref<popOverStatus>('initial')
const tooltip = ref()
const popOver = ref()
const mousePos = ref({
  x: 0,
  y: 0,
})
let selection: Selection | null = null
const isRefreshing = ref(false)

async function fetchAnswer() {
  answer.value = ''
  try {
    isLoading.value = true
    const language = languageList.find(e => e.code === currentLanguage.value)?.name || 'English'
    answer.value = await gemini.getParaphraseFullContent(
      textInput.value.trim(),
      language,
      currentMode.value,
    )
  }
  catch (error) {
  }
  finally {
    isLoading.value = false
  }
}

function countWords(text: string): number {
  return text.split(' ').filter(word => word !== '').length
}
function handleCurrentLanguage(code: string) {
  currentLanguage.value = code
  currentMode.value = 'standard'
}
function mouseMoveHandler(event: MouseEvent) {
  const leftWidth
    = event.clientX - container.value.getBoundingClientRect().left
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
function reSelect() {
  if (!selection?.anchorNode || !selection.focusNode)
    return
  const range = document.createRange()
  range.setStart(selection?.anchorNode, selection?.anchorOffset || 0)
  range.setEnd(selection?.focusNode, selection?.focusOffset || 0)
  selection.removeAllRanges()
  selection.addRange(range)
}
function isMouseInElement(e: HTMLElement) {
  if (!e?.getBoundingClientRect())
    return
  const eBounding = e.getBoundingClientRect()
  return mousePos.value.x >= eBounding.left && mousePos.value.x <= eBounding.right && mousePos.value.y >= eBounding.top && mousePos.value.y <= eBounding.bottom
}
const position = ref({ x: 0, y: 0 })
function resetStatus() {
  // if (window.getSelection)
  // window.getSelection()?.removeAllRanges()
  status.value = 'initial'
  paraphraseText.value = {
    current: {} as ItemParaphraseText,
    history: [] as ItemParaphraseText[],
  }
}
function handleDisplayTooltip() {
  selection = window.getSelection()
  if (!selection?.rangeCount || selection?.toString()?.trim().length === 0) {
    resetStatus()
    return
  }
  status.value = 'tooltip'
  nextTick(attachTooltip)
}
async function refreshParaphraseText() {
  isRefreshing.value = true
  const language = languageList.find(e => e.code === currentLanguage.value)?.name || 'English'
  try {
    const newParaphraseText = await gemini.getParaphraseText(
      answer.value,
      contentParaphrase.value,
      language,
    )
    // const newParaphraseText = 'Replace text over here, hehe'
    paraphraseText.value.current = {
      id: paraphraseText.value.history.length + 1,
      content: newParaphraseText,
    }
    paraphraseText.value.history.push(paraphraseText.value.current as ItemParaphraseText)
    isRefreshing.value = false
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('Has some error')
  }
}
function getThePrevious() {
  const currentID = paraphraseText.value.current.id
  if (currentID > 1)
    paraphraseText.value.current = paraphraseText.value.history[currentID - 2]
}
function getTheFollowing() {
  const currentID = paraphraseText.value.current.id
  const lengHistory = paraphraseText.value.history.length
  if (currentID < lengHistory)
    paraphraseText.value.current = paraphraseText.value.history[currentID]
}
async function handleDisplayPopOver() {
  if (!selection?.anchorNode || !selection?.focusNode)
    return
  contentParaphrase.value = selection?.toString()
  if (!!contentParaphrase.value && contentParaphrase.value?.length > 0) {
    status.value = 'popOver'
    nextTick(attachPopover)
    try {
      refreshParaphraseText()
    }
    catch (error) {
      // resetStatus()
    }
  }
}
function handleBlur() {
  if (isMouseInElement(outPutText.value) || isMouseInElement(tooltip.value) || isMouseInElement(popOver.value))
    reSelect()
  else
    status.value = 'initial'
}
onMounted(() => {
  document.addEventListener('selectionchange', async () => {
    const selection = window.getSelection()
    if (!selection?.rangeCount || selection.toString().length === 0)
      return

    const range = selection.getRangeAt(0)
    // Array like
    rect.value = range.getBoundingClientRect()
    childRect.value = Array.from(range.getClientRects())

    position.value = {
      x: rect.value.left,
      y: rect.value.bottom,
    }
  })

  document.addEventListener('mousemove', (e) => {
    mousePos.value.x = e.clientX
    mousePos.value.y = e.clientY
  })
})
async function copyTextParaphrase() {
  navigator.clipboard.writeText(paraphraseText.value.current.content)
  resetStatus()
}
function pasteText() {
  navigator.clipboard
    .readText()
    .then(clipText => (textInput.value = clipText))
}
function approveParaphraseContent() {
  selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  range?.deleteContents()
  const textNode = document.createTextNode(paraphraseText.value.current.content)
  range?.insertNode(textNode)
  status.value = 'initial'
}

async function attachTooltip() {
  if (tooltip.value) {
    // virtualElement include getBoundingClientRect and getClientRects
    const { x, y, strategy } = await computePosition(virtualElement.value, tooltip.value, {
      strategy: 'absolute',
      placement: 'right',
      middleware: [
        flip(),
        offset({
          mainAxis: 4,
        }),
        inline(),
      ],
    })
    tooltip.value.style.top = `${y - 52}px`
    tooltip.value.style.left = `${x - 210}px`
    tooltip.value.style.position = `${strategy}`
  }
}
async function attachPopover() {
  if (popOver.value) {
    const { x, y, strategy } = await computePosition(virtualElement.value, popOver.value, {
      strategy: 'absolute',
      placement: 'bottom',
      middleware: [
        flip(),
        offset({
          mainAxis: 10,
        }),
      ],
    })
    const maxX = window.innerWidth - 500
    const posX = Math.min(x, maxX)
    popOver.value.style.top = `${y - 52}px`
    popOver.value.style.left = `${posX - 210}px`
    popOver.value.style.position = `${strategy}`
  }
}
</script>

<template>
  <div :class="$style.paragrapher">
    <div :class="$style.paragrapherForm">
      <div :class="$style.paragrapherHeader">
        <div
          v-for="item in languageList"
          :key="item.id"
          :class="[
            $style.paragrapherHeaderLanguage,
            currentLanguage === item.code
              && $style.paragrapherHeaderLanguageActive,
          ]"
          @click="handleCurrentLanguage(item.code)"
        >
          {{ item.name }}
        </div>
      </div>
      <div :class="$style.paragrapherModes">
        <div :class="$style.paragrapherModesTitle">
          Modes:
        </div>
        <div v-for="item in listModes" :key="item.id" div>
          <div
            v-if="
              item.code === 'standard'
                || item?.languages?.includes(currentLanguage)
            "
            :class="[
              $style.paragrapherModesLanguage,
              currentMode === item.code
                && $style.paragrapherModesLanguageActive,
            ]"
            @click="currentMode = item.code"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div ref="container" :class="$style.paragrapherContainer">
        <div ref="inputArea" :class="$style.paragrapherContainerLeft">
          <Icon
            v-if="textInput.trim()"
            icon="mdi:trash-outline"
            :class="$style.paragrapherIconDelete"
            @click="clearText"
          />
          <div v-else :class="$style.paragrapherPaste" @click="pasteText">
            <img src="@/assets/icons/note.svg" :class="$style.paragrapherIconPaste" alt="">
            <span>Paste Text</span>
          </div>
          <textarea
            v-model="textInput"
            :class="$style.paragrapherContainerTextarea"
            placeholder="To rewrite text, enter or paste here and press 'Paraphrase'"
          />
          <div :class="$style.paragrapherContainerLeftFooter">
            <div
              v-if="!textInput.trim()"
              :class="$style.paragrapherContainerLeftUpload"
              @click="pasteText"
            >
              <input
                ref="inputFile"
                type="file"
                name="inputFile"
                :class="$style.inputFile"
                accept=".docx"
              >
              <Icon icon="icons8:upload-2" style="color: #5f6368" />
              <span :class="$style.paragrapherContainerLeftUploadText">Upload Doc</span>
            </div>
            <div v-else :class="$style.paragrapherContainerLeftUpload">
              <span :class="$style.paragrapherContainerLeftCountWords">{{ countWords(textInput) }} words</span>
            </div>
            <button
              v-if="!isLoading"
              type="button"
              :class="$style.paragrapherContainerLeftButtonSubmit"
              @click="fetchAnswer"
            >
              Paraphrase
            </button>
            <button
              v-else
              type="button"
              :class="$style.paragrapherContainerLeftButtonSubmit"
            >
              <img src="@/assets/icons/loading.svg" alt="">
            </button>
          </div>
        </div>
        <div
          :draggable="false"
          :class="$style.paragrapherContainerCenter"
          @mousedown="handleDrag"
        >
          <div />
        </div>
        <div ref="outputArea" :class="$style.paragrapherContainerRight">
          <div
            ref="outPutText"
            :class="$style.paragrapherContainerTextarea"
            contenteditable
            @mouseup="handleDisplayTooltip"
            @mousedown="resetStatus"
            @blur="handleBlur"
          >
            {{ answer }}
          </div>
        </div>
      </div>
    </div>
    <RightMenu />
    <div
      v-if="status === 'tooltip'"
      ref="tooltip"
      :style="{
        cursor: 'pointer',
      }"
      :class="[$style.paraphrasePopUp, $style.paraphraseTooltip]"
      @click="handleDisplayPopOver"
    >
      <img :class="$style.paraphrasePopOverIconStar" src="@/assets/images/sgr_logo_square.png">
    </div>
    <div
      v-else-if="status === 'popOver'"
      ref="popOver"
      :class="[$style.paraphrasePopUp, $style.paraphrasePopOver]"
      @click.stop
    >
      <div :class="$style.paraphrasePopOverHeader">
        <img :class="$style.paraphrasePopOverIconStar" src="@/assets/icons/star.svg">
        <span>S-Group Paraphrase</span>
        <img :class="$style.paraphrasePopOverIconClose" src="@/assets/icons/close.svg" @click="resetStatus">
      </div>

      <div :class="$style.paraphrasePopOverContainer">
        <div :class="$style.paraphrasePopOverContainerHeader">
          <div :class="$style.paraphrasePopOverContainerHeaderRefresh" @click="refreshParaphraseText">
            <img :class="[$style.paraphrasePopOverIconRefresh, isRefreshing === true && $style.loading]" src="@/assets/icons/refresh.svg">
            <span>Refresh</span>
          </div>
          <div v-if="paraphraseText.history.length > 0" :class="$style.paraphrasePopOverContainerHeaderHistory">
            <img src="@/assets/icons/arrow-left.svg" alt="" @click="getThePrevious">
            <span>{{ paraphraseText.current.id }}/{{ paraphraseText.history.length }}</span>
            <img src="@/assets/icons/arrow-right.svg" alt="" @click="getTheFollowing">
          </div>
        </div>
        <div :class="$style.paraphrasePopOverContainerContent">
          {{ paraphraseText.current.content }}
        </div>
      </div>
      <div :class="$style.groupButton">
        <button
          :class="$style.groupButtonCopy"
          @click="copyTextParaphrase"
        >
          Copy
        </button>
        <button
          :class="$style.groupButtonApprove"
          @click.stop="approveParaphraseContent"
        >
          <img src="@/assets/icons/replace.svg" alt="">
          <span>Apply</span>
        </button>
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
  height: 100%;
}

.paragrapherForm {
  height: 70%;
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
  height: 56px;

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
  padding: 6px 9px;
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
    content: "";
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
  height: 100%;
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

.paragrapherPaste {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 130px;
  height: 74px;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--color-green);
  font-size: 12px;
  line-height: 16px;
  color: var(--color-green);
  line-height: 16px;
  padding: 10px;
  gap: 4px;
  font-style: italic;
  cursor: pointer;
  &:hover {
    background-color: var(--color-primary-opacity);
  }
}
.paragrapherIconPaste {
  width: 30px;
  height: 30px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 25px 6px;
  font-size: 17px;
  color: #fff;
  font-weight: bold;
  border-radius: 25px;
  text-transform: capitalize;
  position: relative;
  width: 140px;
  min-width: 140px;
  min-height: 40px;
  background-color: #499557;
  border: none;
}

.paragrapherContainerCenter {
  width: 10px;
  border-left: 3px solid #44474663;
  cursor: col-resize;

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

.paraphrasePopUp {
  position: fixed;
}
.paraphraseTooltip {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 4px;
  background-color: #fff;
  box-shadow: 0 0.375rem 0.75rem 0 rgba(0, 0, 0, 0.5);
  img {
    width: 24px;
    height: 24px;
  }
}
.paraphrasePopOver {
  padding: 12px 12px 8px 12px;
  border-radius: 12px;
  width: 480px;
  height: 280px;
  background-color: #fff;
  box-shadow: 0 0.375rem 0.75rem 0 rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column ;
  gap:16px;
}

.paraphrasePopOverHeader {
  display: flex;
  align-items: center;
}
.paraphrasePopOverHeader span {
  flex:1;
  font-size: 16px;
  color: #555555;
}
.paraphrasePopOverContainer {
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  gap: 4px;
}
.paraphrasePopOverContainerHeader {
  display: flex;
  justify-content: space-between;
  color: #A9A9A9;
  font-size: 12px;
  line-height: 17px;
}
.paraphrasePopOverContainerHeaderRefresh {
  display: flex;
  align-items:center;
  cursor: pointer;
}
.paraphrasePopOverIconRefresh {
  width: 18px;
  height: 18px;
}
.paraphrasePopOverContainerHeaderHistory {
  display: flex;

  img {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.paraphrasePopOverContainerContent {
  padding: 12px;
  border-radius: 10px;
  background-color: #f8f8f8;
  font-size: 16px;
  line-height: 22px;
  color:#555555;
  height: 120px;
  overflow: auto;
}
.paraphrasePopOverIconStar {
  width: 32px;
  height: 32px;
}
.paraphrasePopOverIconClose {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.textParaphrase {
  font-size: 14px;
  line-height: 20px;
  color: #505050;
  font-weight: 400;
}
.groupButton {
  display: flex;
  gap: 8px;
  padding: 16px;
  padding-top: 0;
  justify-content: flex-end;
  // height: 52px;
}
.groupButtonCopy {
  padding: 6px 16px;
  border: 1px solid #DADCE0;
  border-radius: 48px;
  font-size: 14px;
  line-height: 20px;
  background-color: #FFFFFF;
  color: #555555;
}
.groupButtonApprove {
  padding: 8px 12px;
  height: 36px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  background: #4643DD;
  border: none;
  img {
    width: 24px;
    height: 24px;
  }
  span {
    display: flex;
    padding: 0 4px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    letter-spacing: 0.8px;
  }
}
.loading {
  animation: loading 1.5s linear  infinite;
}
@keyframes loading {
  0%{ -webkit-transform: rotate(0deg); transform: rotate(360deg);}
	100%{ -webkit-transform: rotate(360deg); transform: rotate(0deg);}
}
</style>
