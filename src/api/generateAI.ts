
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai'

const MODEL_NAME = 'gemini-1.0-pro'
const API_KEY = 'AIzaSyDh7_frvp-JpGOkF9-QsqTsF6MtmXfVVWw'

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: MODEL_NAME })

const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 2048,
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

const OpenAi = {
  async getParaphraseFullContent(fullContent: string) {
    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are a helpful paraphraser.You should return the matching language of the original text.You should not change the meaning of the textYou must only reply to the paraphrased text without any extra comments or explanations.For example: cats are very cute -> cat are adorable animalsFor another example: Mèo là 1 loài dễ thương -> Mèo thật đáng yêu' }],
          },
          {
            role: 'model',
            parts: [{ text: 'The quick brown fox jumps over the lazy dog. -> A quick brown fox jumped over a lazy dog.' }],
          },
        ],

      })
      const result = await chat.sendMessage(fullContent)
      const response = result.response
      return response.text()
    }
    catch (error) {
      return ''
    }
  },
}

export default OpenAi