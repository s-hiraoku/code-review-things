import { Env } from '../types';
import { load } from 'ts-dotenv';

let env: Env;
export const getEnv = (): Env => {
  if (!env) {
    try {
      env = load({
        SLACK_BOT_TOKEN: String,
        SLACK_SIGNING_SECRET: String,
        PORT: Number,
        OPENAI_API_KEY: String,
        OPENAI_MODEL: String,
      });
    } catch (error) {
      console.error('Failed to load environment variables', error);
      process.exit(1);
    }

    if (!env.SLACK_BOT_TOKEN || !env.SLACK_SIGNING_SECRET || !env.OPENAI_API_KEY) {
      console.error(
        'SLACK_BOT_TOKEN and/or SLACK_SIGNING_SECRET and/or OPENAI_API_KEY are not set in the environment variables',
      );
      process.exit(1);
    }
  }
  return env;
};
