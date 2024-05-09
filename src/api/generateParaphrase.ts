// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY as string;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
};

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
];

const createChat = {
  getParaphraseFullContent: async (fullContent: string): Promise<string> => {
    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "You are a helpful paraphraser. You should return the matching language of the original text. You should not change the meaning of the text You must only reply to the paraphrased text without any extra comments or explanations. For example: Cats are very cute animals -> Cats are adorable animals For another example: Mèo là loài rất dễ thương -> Mèo là loài rất đáng yêu Now please paraphrase this:",
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: "What is the purpose of living?" }],
          },
        ],
      });
      if(fullContent.length>0){
        const result = await chat.sendMessage(fullContent);
        const response = result.response;
        return response.text();
      }
      return "Có gì đâu mà bắt paraphrase 😔";
    } catch (error) {
      return "";
    }
  },
  getParaphraseText: async (
    fulltext: string,
    content: string,
  ): Promise<string> => {
    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "You are a helpful paraphraser.            You should return the matching language of the original text.            You should not change the meaning of the text            You must only reply to the paraphrased text without any extra comments or explanations.            For example            Full text: Cats are very cute animals            Paraphrased text: very cute animals            Result: adorable animals            Full text: Mèo là loài rất dễ thương            Paraphrased text: rất dễ thương            Result: rất đáng yêu            Now please paraphrase this            Full text: tôi rất vui tính           Paraphrased text: rất vui tính",
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: "hài hước" }],
          },
        ],
      });

      const result = await chat.sendMessage(
        `Full text: ${fulltext} Paraphrased text: ${content}`,
      );
      const response = result.response;
      return response.text();
    } catch (error) {
      return "";
    }
  },
};

export default createChat;
