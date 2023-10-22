import { App, SayFn } from '@slack/bolt';
import { OPEN_AI_ROLE_TYPE, OpenAIMessages } from './types';
import { ConversationsRepliesResponse, Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { sanitizeText } from './utils';
import { WebClient } from '@slack/web-api';

export const sendMessageToSlack = async (say: SayFn, text: string, eventTS: string): Promise<void> => {
  await say({
    text,
    thread_ts: eventTS,
  });
};

export const getSlackThreadMessages = async (
  client: WebClient,
  channel: string,
  threadTs: string,
): Promise<ConversationsRepliesResponse> => {
  try {
    const threadMessagesResponse = await client.conversations.replies({
      channel,
      ts: threadTs,
    });
    return threadMessagesResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSlackBotId = async (app: App, slackBotToken: string): Promise<string | undefined> => {
  try {
    const result = await app.client.auth.test({ token: slackBotToken });
    const botUserId = result.user_id; // user_id contains the Bot User ID
    console.log('Bot User ID:', botUserId);
    return botUserId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const covertSlackMessageToOpenAIMessage = (slackMessages: Message[], slackBotId: string): OpenAIMessages => {
  // Set Conversation history to conversations.
  const conversations = slackMessages.reduce((acc: OpenAIMessages, message) => {
    if (message.text) {
      const role = message.user === slackBotId ? OPEN_AI_ROLE_TYPE.assistant : OPEN_AI_ROLE_TYPE.user;
      const content = sanitizeText(message.text);
      acc.push({ role: role, content });
    }
    return acc;
  }, []);
  return conversations;
};
