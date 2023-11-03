import { intro, outro, text } from '@clack/prompts';
import { bgLightGreen, green } from 'kolorist';
import { Env } from '../types/env';
import { promises as fs } from 'fs';
import { ENV_FILE_NAME } from '../constants';
import { handleCliError } from '../utils/error';
import * as path from 'path';
import { fileURLToPath } from 'url';

export const setEnv = async (): Promise<void> => {
  try {
    const env: Env = {
      SLACK_BOT_TOKEN: '',
      SLACK_BOT_ID: '',
      SLACK_CHANNEL_ID: '',
    };
    intro(bgLightGreen(' aireview setup .env '));

    env.SLACK_BOT_TOKEN = (await text({
      message: `Please enter your Slack Bot Token: ${green('SLACK_BOT_TOKEN')}`,
      placeholder: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx',
      initialValue: env.SLACK_BOT_TOKEN,
      validate: (input) => {
        if (input.length === 0) {
          return 'Please enter your Slack Bot Token';
        }
      },
    })) as string;

    env.SLACK_BOT_ID = (await text({
      message: `Please enter your Slack Bot ID: ${green('SLACK_BOT_ID')}`,
      placeholder: 'xxxxxxxxx',
      initialValue: env.SLACK_BOT_ID,
      validate: (input) => {
        if (input.length === 0) {
          return 'Please enter your Slack Bot ID';
        }
      },
    })) as string;

    env.SLACK_CHANNEL_ID = (await text({
      message: `Please enter your Slack Channel ID: ${green('SLACK_CHANNEL_ID')}`,
      placeholder: 'xxxxxxxxx',
      initialValue: env.SLACK_CHANNEL_ID,
      validate: (input) => {
        if (input.length === 0) {
          return 'Please enter your Slack Channel ID';
        }
      },
    })) as string;

    // Write .env file
    const envFile = Object.keys(env)
      .map((key) => `${key}=${env[key as keyof Env]}`)
      .join('\n');

    const currentFileUrl = import.meta.url;
    const appDirectory = path.dirname(fileURLToPath(currentFileUrl));
    const envFilePath = path.join(appDirectory, ENV_FILE_NAME);
    await fs.writeFile(envFilePath, envFile);

    outro(`🎉 ${bgLightGreen(' .env file has been set up ')}`);
  } catch (error) {
    console.error('Failed to set environment variables', error);
    handleCliError(error);
    process.exit(1);
  }
};

export const getEnv = async (): Promise<void> => {
  try {
    intro(bgLightGreen('this is aireview .env '));

    const currentFileUrl = import.meta.url;
    const appDirectory = path.dirname(fileURLToPath(currentFileUrl));
    const envFilePath = path.join(appDirectory, ENV_FILE_NAME);
    const envFileContent = await fs.readFile(envFilePath, 'utf8');

    console.log('.env file path', envFilePath);
    console.log(envFileContent);

    outro(`🎉 ${bgLightGreen(' .env file has been read ')}`);
  } catch (error) {
    console.error('Failed to read .env file', error);
  }
};
