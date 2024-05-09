export const openai = {
  async getParaphraseText(content: string, fullContent: string) {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `
            You are a helpful paraphraser.
            You should return the matching language of the original text.
            You should not change the meaning of the text
            You must only reply to the paraphrased text without any extra comments or explanations.
            For example
            Full text: Cats are very cute animals
            Paraphrased text: very cute animals
            Result: adorable animals
            Full text: Mèo là loài rất dễ thương
            Paraphrased text: rất dễ thương
            Result: rất đáng yêu
            Now please paraphrase this
            Full text: ${fullContent}
            Paraphrased text: ${content}
            `,
              },
              {
                role: "user",
                content: "Hello!",
              },
            ],
          }),
        },
      );

      const getChatCompletion = await response.json();
      return getChatCompletion.choices[0]?.message?.content;
    } catch {
      return "";
    }
  },
  async getParaphraseFullContent(fullContent: string) {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a helpful paraphraser.
            You should return the matching language of the original text.
            You should not change the meaning of the text
            You must only reply to the paraphrased text without any extra comments or explanations.
            For example: Cats are very cute animals -> Cats are adorable animals
            For another example: Mèo là loài rất dễ thương -> Mèo là loài rất đáng yêu
            Now please paraphrase this: ${fullContent}
            `,
              },
              {
                role: "user",
                content: "Hello!",
              },
            ],
          }),
        },
      );

      const getChatCompletion = await response.json();
      return getChatCompletion.choices[0]?.message?.content;
    } catch {
      return "";
    }
  },
};
