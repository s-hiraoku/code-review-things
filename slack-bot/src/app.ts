import { App } from '@slack/bolt';
import { getSlackBotId, sendMessageToSlack } from './slack';
import { initOpenAI } from './openai';
import { REVIEW_REQUEST_MESSAGE, SLACK_EMPTY_MESSAGE_REPLY } from '../../shared/messages';
import { getEnvVariables, processReviewCode, getOpenAIResponseAndReplyToThread } from './helpers';
import { sanitizeText } from './utils';

const DEFAULT_PORT = 8080;

let slackBotId: string | undefined;
const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, PORT, OPENAI_API_KEY, OPENAI_MODEL } = getEnvVariables();

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

app.event('app_mention', async ({ event, client, say }) => {
  const { text: currentText, ts: eventTS, user } = event;
  const threadTs = event.thread_ts ? event.thread_ts : event.ts;

  const currentMessage = sanitizeText(currentText);

  console.log('Current message:', currentMessage);

  if (!currentMessage) {
    await sendMessageToSlack(say, SLACK_EMPTY_MESSAGE_REPLY, eventTS);
    return;
  }

  if (currentMessage === REVIEW_REQUEST_MESSAGE) {
    processReviewCode(client, event, eventTS, SLACK_BOT_TOKEN, slackBotId, say);
    return;
  }

  getOpenAIResponseAndReplyToThread(client, event.channel, threadTs, user, slackBotId, say);
});

(async (): Promise<void> => {
  await app.start(PORT || DEFAULT_PORT);

  slackBotId = await getSlackBotId(app, SLACK_BOT_TOKEN);

  await initOpenAI(OPENAI_API_KEY, OPENAI_MODEL);

  console.log('⚡️ Bolt app is running!');
})();
