
const OPENAI_API_KEY_STORAGE_KEY = 'openai_api_key';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const openAiApi = {
  getApiKey: (): string | null => {
    return localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
  },

  setApiKey: (apiKey: string) => {
    if (apiKey) {
      localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
    }
  },

  assessStyle: async (image_base64: string, style_description: string): Promise<string> => {
    const apiKey = openAiApi.getApiKey();
    if (!apiKey) {
      throw new Error("OpenAI API key not found. Please set it in the application.");
    }

    console.log("Calling OpenAI API for style assessment...");

    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Based on the attached image, does this outfit fit with the following style description: "${style_description}"? Please provide a short, helpful assessment in a friendly tone. If the style is not clear from the description, just describe the outfit's style.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image_base64,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: { message: `Request failed with status ${response.status}` } };
      }
      console.error("OpenAI API Error:", errorData);
      throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("OpenAI API call successful.");

    if (result.choices && result.choices.length > 0 && result.choices[0].message?.content) {
      return result.choices[0].message.content;
    }

    throw new Error("The API did not return a valid assessment.");
  },
};
