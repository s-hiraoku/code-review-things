import { execa } from 'execa';
import { KnownError } from './error.js';
import { promises as fs } from 'fs';

export const archiveDirectoryAsZip = async (sourceDirectory: string, outputZip: string): Promise<string> => {
  try {
    const { stdout } = await execa('zip', ['-r', outputZip, sourceDirectory]);
    return stdout;
  } catch (error) {
    throw new KnownError('Failed to make zip file!');
  }
};

export const removeDirectory = async (
  dirPath: string,
  recursive: boolean = true,
  ignoreIfAbsent: boolean = true,
): Promise<void> => {
  try {
    await fs.access(dirPath);
    await fs.rm(dirPath, { recursive });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error['code'] === 'ENOENT' &&
      ignoreIfAbsent
    ) {
      return;
    }
    console.error(`Failed to remove directory at ${dirPath}`, error);
    throw error;
  }
};

const isDirEmptyOrFileMissing = async (dirPath: string, fileName?: string): Promise<boolean> => {
  try {
    const files = await fs.readdir(dirPath);
    return fileName ? !files.includes(fileName) : files.length === 0;
  } catch (error) {
    console.error(`Failed to read directory at ${dirPath}`, error);
    throw error;
  }
};

const MAX_TRIES = 100;
export const findAvailableDirectory = async (baseDir: string, fileName?: string): Promise<string> => {
  if (await isDirEmptyOrFileMissing(baseDir, fileName)) {
    return baseDir;
  }

  for (let index = 1; index <= MAX_TRIES; index++) {
    const dirName = `${baseDir}__${index}`;
    const isEmpty = await isDirEmptyOrFileMissing(dirName, fileName);

    if (isEmpty) {
      return dirName;
    }

    index++;
  }

  throw new Error('Max tries exceeded to find an available directory');
};
