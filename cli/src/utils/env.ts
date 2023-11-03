import { Env } from '../types';
import { load } from 'ts-dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ENV_FILE_NAME } from '../constants';

export const getEnv = (): Env => {
  try {
    const currentFileUrl = import.meta.url;
    const appDirectory = path.dirname(fileURLToPath(currentFileUrl));
    const envFilePath = path.join(appDirectory, ENV_FILE_NAME);
    const env = load(
      {
        SLACK_BOT_TOKEN: String,
        SLACK_BOT_ID: String,
        SLACK_CHANNEL_ID: String,
      },
      envFilePath,
    );
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
