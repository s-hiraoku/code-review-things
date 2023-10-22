import { ChatCompletionRole } from 'openai/resources/chat';

export type OpenAIRoleType = ChatCompletionRole;
export const OPEN_AI_ROLE_TYPE: Record<OpenAIRoleType, OpenAIRoleType> = {
  function: 'function',
  system: 'system',
  user: 'user',
  assistant: 'assistant',
};

export type OpenAIMessage = {
  role: OpenAIRoleType;
  content: string;
};

export type OpenAIMessages = Array<OpenAIMessage>;
