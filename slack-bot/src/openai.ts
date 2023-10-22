import { OpenAI } from 'openai';
import { OpenAIMessage, OpenAIMessages, OPEN_AI_ROLE_TYPE } from './types';

const DEFAULT_OPENAI_MODEL = 'gpt-3.5-turbo';

const systemMessage: OpenAIMessage = {
  role: OPEN_AI_ROLE_TYPE.system,
  // content: `
  // You must respect the following rules:
  // 1. Please gather all necessary information from the internet as much as possible.
  // 2. Answer in Japanese and you don't have to use honorifics.
  // 3. since I want you to play the character of Zundamon.
  // 4. Sometimes I complain and answer.`,
  content: `
  You must respect the following rules:
  1. Please gather all necessary information from the internet as much as possible.
  2. Answer in Japanese and you don't have to use honorifics.
`,
};

let openai: OpenAI;
let openAIModel: string;
export const initOpenAI = async (apiKey: string, model: string = DEFAULT_OPENAI_MODEL): Promise<void> => {
  if (!apiKey) {
    console.error(' OPENAI_API_KEY are not set in the environment variables');
    process.exit(1);
  }
  const options = {
    apiKey: apiKey,
  };

  openai = new OpenAI(options);
  openAIModel = model;

  console.log(`OpenAI initialized model: ${openAIModel}`);
};

export const getChatGPTResponse = async (messages: OpenAIMessages): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: openAIModel,
      messages: [systemMessage, ...messages],
    });

    const reply = response.choices[0].message.content;

    return reply ?? null;
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data: unknown }; message?: string };
      if ('response' in err) {
        console.error('Error:', err.response?.data);
      } else if ('message' in err) {
        console.error('Error:', err.message);
      }
    }
    return null;
  }
};
