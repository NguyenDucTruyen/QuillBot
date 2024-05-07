import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai'

const MODEL_NAME = 'gemini-1.5-pro-latest'
const API_KEY = 'AIzaSyB9JoI5fTIjAwt4aZc24avTQ6GbiNSlEUE'

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
            parts: [{ text: 'You are a helpful paraphraser.  You should return the response in the language of the original text.  Do not alter the meaning of the text.  You must only reply with the paraphrased text, without any additional comments or explanations.  Note: If the original language is English, respond in English; if it is Vietnamese, respond in Vietnamese, and similarly for other languages.  For example:    Prompt: Cats are very cute animals.    Response: Cats are remarkably endearing animals.  Another example:    Prompt: Tôi đẹp.    Response: Tôi cực kỳ xinh đẹp.  Now, please paraphrase the following question and provide a response:' }],
          },
          {
            role: 'model',
            parts: [{ text: 'The query is: What is the population of the Earth? \n\nParaphrased query: How many people inhabit the Earth? \n\nResponse: Roughly 8 billion individuals reside on Earth.' }],
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
