<script lang="ts" setup>
import gemini from '@/api/generateParaphrase.ts'

interface ItemParaphraseText {
  id: number
  content: string
}
const props = defineProps<{
  language: string
  answer: string
}>()

const emit = defineEmits<{
  (e: 'resetStatus'): void
  (e: 'approveParaphraseContent', content: string): void
}>()
const { language, answer } = toRefs(props)
const isRefreshing = ref(false)
const contentParaphrase = ref('')
const paraphraseText = ref({
  current: {} as ItemParaphraseText,
  history: [] as ItemParaphraseText[],
})
async function refreshParaphraseText() {
  isRefreshing.value = true
  try {
    const newParaphraseText = await gemini.getParaphraseText(
      answer.value,
      contentParaphrase.value,
      language.value,
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
async function copyTextParaphrase() {
  navigator.clipboard.writeText(paraphraseText.value.current.content)
  reset()
}

function reset() {
  emit('resetStatus')
}

function approveParaphraseContent() {
  emit('approveParaphraseContent', paraphraseText.value.current.content)
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
</script>

<template>
  <div
    :class="$style.paraphrasePopOver"
  >
    <div :class="$style.paraphrasePopOverHeader">
      <img :class="$style.paraphrasePopOverIconStar" src="@/assets/icons/star.svg">
      <span>S-Group Paraphrase</span>
      <img :class="$style.paraphrasePopOverIconClose" src="@/assets/icons/close.svg" @click="reset">
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
</template>

<style lang="scss" module>
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
