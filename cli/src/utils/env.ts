import { Env } from '../types';
import { load } from 'ts-dotenv';

export const getEnv = (): Env => {
  try {
    const env = load({
      SLACK_BOT_TOKEN: String,
      SLACK_BOT_ID: String,
      SLACK_CHANNEL_ID: String,
    });
    if (!env.SLACK_BOT_TOKEN || !env.SLACK_BOT_ID || !env.SLACK_CHANNEL_ID) {
      console.error(
        'SLACK_BOT_TOKEN and/or SLACK_BOT_ID and/or SLACK_CHANEL_ID are not set in the environment variables',
      );
      process.exit(1);
    }
    return env;
  } catch (err) {
    console.error('Failed to load environment variables', err);
    process.exit(1);
  }
};
