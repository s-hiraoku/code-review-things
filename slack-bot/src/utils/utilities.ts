import { SlackFiles } from '../types';

export const SLACK_MENTION_REGEXP = /<@[A-Za-z0-9]+>/g;
export const NEWLINE_REGEXP = /\n/g;
export const EMPTY_STRING = '';

export const sanitizeText = (text: string): string => {
  return text.replace(SLACK_MENTION_REGEXP, EMPTY_STRING).replace(NEWLINE_REGEXP, EMPTY_STRING);
};

export const validateFiles = (files: SlackFiles): boolean => {
  return files.length > 0 && files.length <= 1 && files[0].filetype === 'zip';
};
