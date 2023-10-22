import { AppMentionEvent, SayFn } from '@slack/bolt';
import { downloadFile, getEnv, validateFiles } from './utils';
import { covertSlackMessageToOpenAIMessage, sendMessageToSlack, getSlackThreadMessages } from './slack';
import { Env, OPEN_AI_ROLE_TYPE, OpenAIMessages, SlackFiles } from './types';
import { WebClient } from '@slack/web-api';
import { getChatGPTResponse } from './openai';
import admZip from 'adm-zip';
import { OPENAI_RESTORE_CODE_MESSAGE, SLACK_START_REVIEW_MESSAGE, chatGPTRequestMessages } from './messages';

export const getEnvVariables = (): Env => {
  const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, PORT, OPENAI_API_KEY, OPENAI_MODEL } = getEnv();

  if (!SLACK_BOT_TOKEN || !OPENAI_API_KEY) {
    console.error(' SLACK_BOT_TOKEN or OPENAI_API_KEY are not set in the environment variables');
    process.exit(1);
  }

  return {
    SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET,
    PORT,
    OPENAI_API_KEY,
    OPENAI_MODEL,
  };
};

export const getOpenAIResponseAndReplyToThread = async (
  client: WebClient,
  channel: string,
  threadTs: string,
  user: string | undefined,
  slackBotId: string | undefined,
  say: SayFn,
): Promise<void> => {
  try {
    const threadMessagesResponse = await getSlackThreadMessages(client, channel, threadTs);
    const threadMessages = threadMessagesResponse.messages;

    if (threadMessages && slackBotId) {
      const conversations = covertSlackMessageToOpenAIMessage(threadMessages, slackBotId);
      const reply = await getChatGPTResponse(conversations as OpenAIMessages);
      if (reply) {
        await sendMessageToSlack(say, reply, threadTs);
      }
    }
  } catch (error) {
    console.error(error);
    await sendMessageToSlack(
      say,
      `<@${user}>\n A defect has occurred. Please contact the developer.\n\n${error}`,
      threadTs,
    );
  }
};

const DIFF_FILES_DIR = 'git-diff-files';
export const processReviewCode = async (
  client: WebClient,
  event: AppMentionEvent,
  eventTS: string,
  slackBotToken: string,
  slackBotId: string | undefined,
  say: SayFn,
): Promise<void> => {
  if (!('files' in event && event.files && validateFiles(event.files as SlackFiles))) {
    await sendMessageToSlack(say, 'Attached file is invalid.', eventTS);
    return;
  }
  const fileUrl = (event.files as SlackFiles)[0].url_private;
  const zipFile = await downloadFile(fileUrl, slackBotToken);
  const zip = new admZip(zipFile);
  const zipEntries = zip.getEntries();

  const topDirectoryName = zipEntries[0].entryName.split('/')[0];
  if (topDirectoryName !== DIFF_FILES_DIR) {
    await sendMessageToSlack(say, 'Invalid directory name for attachment.', eventTS);
    return;
  }

  const diffDirectoryNames = zipEntries
    .filter((entry) => entry.isDirectory)
    .map((entry) => entry.entryName.split('/')[1])
    .filter((name) => name !== '');

  console.log('diffDirectoryNames', diffDirectoryNames);

  for (const diffDirectoryName of diffDirectoryNames) {
    const diffFileText = zip.readAsText(`${DIFF_FILES_DIR}/${diffDirectoryName}/${diffDirectoryName}.diff`);
    const originalFileNames = zipEntries
      .filter(
        (entry) =>
          entry.entryName.startsWith(`${DIFF_FILES_DIR}/${diffDirectoryName}/`) &&
          !entry.isDirectory &&
          `${DIFF_FILES_DIR}/${diffDirectoryName}/${diffDirectoryName}.diff` !== entry.entryName,
      )
      .map((entry) => entry.entryName.split('/').slice(2).join('/'));

    const originalFileTexts = originalFileNames.map((originalFileName) =>
      zip.readAsText(`${DIFF_FILES_DIR}/${diffDirectoryName}/${originalFileName}`),
    );

    const content = createReviewCodeRestorePrompt(diffFileText, originalFileTexts);
    try {
      const result = await say(SLACK_START_REVIEW_MESSAGE(diffDirectoryName));
      const reply = await getChatGPTResponse([{ role: OPEN_AI_ROLE_TYPE.user, content }]);

      if (reply) {
        await say({ text: reply, thread_ts: result.ts });
      }
      await processChatGPTRequest(client, result.channel, result.ts, slackBotId, say);
    } catch (error) {
      console.error('Error sending content:', error);
    }
  }
};

const processChatGPTRequest = async (
  client: WebClient,
  channel: string | undefined,
  eventTS: string | undefined,
  slackBotId: string | undefined,
  say: SayFn,
): Promise<void> => {
  for (const content of chatGPTRequestMessages) {
    if (!channel || !eventTS) {
      console.error('channel or eventTS is undefined');
      return;
    }
    const threadMessagesResponse = await client.conversations.replies({
      channel,
      ts: eventTS,
    });

    const threadMessages = Array.isArray(threadMessagesResponse.messages) ? threadMessagesResponse.messages : [];
    if (slackBotId) {
      const conversations = covertSlackMessageToOpenAIMessage(threadMessages, slackBotId);
      const reply = await getChatGPTResponse([...conversations, { role: OPEN_AI_ROLE_TYPE.user, content }]);
      if (reply) {
        await say({ text: reply, thread_ts: eventTS });
      }
    }
  }
};

const createReviewCodeRestorePrompt = (diffFileText: string, baseFileTexts: string[]): string => {
  return `${OPENAI_RESTORE_CODE_MESSAGE}\n
  ------------------------------------------- diff file -------------------------------------------\n
  ${diffFileText}\n
  ----------------------------------------- original file -----------------------------------------\n
  ${baseFileTexts.join('\n')}
  `;
};
