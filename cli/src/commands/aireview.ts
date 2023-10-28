import { black, bgCyan, green, red } from 'kolorist';
import { intro, outro, spinner, confirm } from '@clack/prompts';
import { assertGitRepo, getGitDiff, getGitShow } from '../utils/git';
import { archiveDirectoryAsZip, findAvailableDirectory, removeDirectory } from '../utils/file';
import { KnownError, handleCliError } from '../utils/error';
import path from 'path';
import { DiffFiles } from '../types/aireview';
import { promises as fs } from 'fs';
import { open } from 'node:fs/promises';
import { DIFF_EXTENSION, DIFF_FILES_DIR, ZIP_FILE_NAME } from '../constants';
import { WebClient } from '@slack/web-api';
import { getEnv } from '../utils/env';
import { REVIEW_REQUEST_MESSAGE } from '../../../shared/messages';

export const aireview = async (output: boolean): Promise<void> => {
  try {
    const cwdDiffFilesDir = path.join(process.cwd(), DIFF_FILES_DIR);

    intro(bgCyan(black(' aireview ')));
    await assertGitRepo();

    const result = await checkExistStagedFiles();
    if (result === PROCESS_RESULT.Failed) {
      throw new Error('checkExistStagedFiles failed!');
    }

    const resultMessage = await processGitDiffFiles();
    const extractionStatus = await createZipFile(cwdDiffFilesDir, output);

    if (!resultMessage || !extractionStatus) {
      throw new Error('Process failed!');
    }

    outro(`${green('✔')} File output succeeded!`);

    await postMessageWithZipFileToSlack();

    outro(`${green('✔')} Slack message sent successfully!`);
    outro(`🎉 ${bgCyan(' To be continued on Slack ')}`);

    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof KnownError) {
      outro(`${red('✖')} ${error.message}`);
    }
    handleCliError(error);
    process.exit(1);
  }
};

const postMessageWithZipFileToSlack = async (): Promise<void> => {
  const { SLACK_BOT_TOKEN, SLACK_BOT_ID, SLACK_CHANNEL_ID } = getEnv();

  const client = new WebClient(SLACK_BOT_TOKEN);
  const filePath = path.join(process.cwd(), ZIP_FILE_NAME);
  const fileName = ZIP_FILE_NAME;
  const title = ZIP_FILE_NAME;
  const message = `<@${SLACK_BOT_ID}>\n${REVIEW_REQUEST_MESSAGE}`;

  try {
    const fd = await open(filePath, 'r');
    await client.files.uploadV2({
      channel_id: SLACK_CHANNEL_ID,
      file: fd.createReadStream(),
      filename: fileName,
      title: title,
      initial_comment: message,
    });
  } catch (error) {
    console.error('Failed to post message with zip file to slack', error);
    throw error;
  }
};

type ProcessResult = 'Success' | 'Failed';
const PROCESS_RESULT: Record<ProcessResult, ProcessResult> = {
  Success: 'Success',
  Failed: 'Failed',
};

const processGitDiffFiles = async (): Promise<ProcessResult> => {
  const checkGitDiffFiles = spinner();
  checkGitDiffFiles.start('Checking Git Diff Files...');

  try {
    const outputGitDiff = await getGitDiff({ staged: true, nameOnly: true });
    const diffFiles = outputGitDiff.split('\n').filter(Boolean);

    if (diffFiles.length === 0) {
      checkGitDiffFiles.stop('No diff files found!');
      throw new Error('No diff files found! Please check your diff files.');
    }

    checkGitDiffFiles.stop(`Git diff files:\n${diffFiles.map((file) => `     ${file}`).join('\n')}`);

    return PROCESS_RESULT.Success;
  } catch (error) {
    console.error('Error occurred while checking diff files', error);
    throw error;
  }
};

const createZipFile = async (cwdDiffFilesDir: string, remainDiffFiles: boolean): Promise<ProcessResult> => {
  const extractingFiles = spinner();
  extractingFiles.start('Creating Zip File...');

  try {
    await removeDirectory(cwdDiffFilesDir);
    await removeDirectory(ZIP_FILE_NAME);

    await outputGitDiffsByDirectory(DIFF_FILES_DIR);
    await archiveDirectoryAsZip(DIFF_FILES_DIR, ZIP_FILE_NAME);

    if (!remainDiffFiles) {
      await removeDirectory(cwdDiffFilesDir);
    }

    return PROCESS_RESULT.Success;
  } catch (error) {
    console.error('An error occurred while creating the zip file.', error);
    throw error;
  } finally {
    extractingFiles.stop();
  }
};

const checkExistStagedFiles = async (): Promise<ProcessResult> => {
  const checkStagedFiles = spinner();
  checkStagedFiles.start('Checking Staged Files...');

  try {
    const outputGitDiff = await getGitDiff({ staged: true, nameOnly: true });
    const diffFiles = outputGitDiff.split('\n').filter(Boolean);

    if (diffFiles.length === 0) {
      checkStagedFiles.stop('No staged files found!');
      throw new KnownError('No staged files found! Please check your staged files.');
    }

    checkStagedFiles.stop(`Staged files:\n${diffFiles.map((file) => `     ${file}`).join('\n')}`);

    return (await confirm({
      message: 'Would you like to continue processing with the above Staged files?',
    }))
      ? PROCESS_RESULT.Success
      : PROCESS_RESULT.Failed;
  } catch (error: unknown) {
    if (error instanceof KnownError) {
      checkStagedFiles.stop(error.message || 'An error occurred while checking staged files.');
    }
    throw error;
  }
};

const outputGitDiffsByDirectory = async (outputDirectory: string): Promise<void> => {
  try {
    const diffOutput = await getGitDiff({ staged: true });
    const diffFiles = getDiffFiles(diffOutput);

    await makeDiffFilesDirectory(outputDirectory, diffFiles);
    await saveOriginalFiles(outputDirectory, diffFiles);
    await saveDiffOutput(outputDirectory, diffFiles, diffOutput);
  } catch (error) {
    console.error('Failed to get git diff(outputGitDiffsByDirectory)', error);
    throw error;
  }
};

const getDiffFiles = (diffOutput: string): DiffFiles => {
  return diffOutput
    .split('\n')
    .filter((line) => line.startsWith('diff --git'))
    .map((line) => {
      const path = line.split(' ')[2].split('a/')[1];
      const name = path.split('/').pop() as string;
      return {
        path,
        name,
        content: '',
      };
    });
};

const makeDiffFilesDirectory = async (outputDirectory: string, diffFiles: DiffFiles): Promise<void> => {
  const filePath = path.join(process.cwd(), outputDirectory);
  const directoryNames: string[] = [];

  // If there is a duplicate name in diffFiles, create a directory with the name appended with __index.
  diffFiles.forEach((file) => {
    const baseName = file.name.split('.')[0];
    let newName = baseName;
    let index = 1;

    while (directoryNames.includes(newName)) {
      newName = `${baseName}__${index}`;
      index++;
    }

    directoryNames.push(newName);
  });

  try {
    await Promise.all(directoryNames.map((dirName) => fs.mkdir(path.join(filePath, dirName), { recursive: true })));
  } catch (error) {
    console.error(`Failed to make directory at ${filePath}`, error);
    throw error;
  }
};

const saveOriginalFiles = async (outputDirectory: string, diffFiles: DiffFiles): Promise<void> => {
  try {
    for (const { path: filePath, name: fileName } of diffFiles) {
      const fileContent = await getGitShow(filePath);
      const saveDirectoryPath = await findAvailableDirectory(
        path.join(process.cwd(), outputDirectory, fileName.split('.')[0]),
        fileName,
      );
      await fs.writeFile(path.join(saveDirectoryPath, fileName), fileContent);
    }
  } catch (error) {
    console.error('Failed to write file(saveOriginalFiles)', error);
    throw error;
  }
};

const saveDiffOutput = async (outputDirectory: string, diffFiles: DiffFiles, diffOutput: string): Promise<void> => {
  const separateDiffs = separateDiffFiles(diffFiles, diffOutput);

  try {
    for (const { name: fileName, content } of separateDiffs) {
      const saveDirectoryPath = await findAvailableDirectory(
        path.join(process.cwd(), outputDirectory, fileName.split('.')[0]),
        fileName.replace(/\.[^.]+$/, DIFF_EXTENSION),
      );
      await fs.writeFile(path.join(saveDirectoryPath, fileName.replace(/\.[^.]+$/, DIFF_EXTENSION)), content);
    }
  } catch (error) {
    console.error('Failed to write file(saveDiffOutput)', error);
    throw error;
  }
};

const separateDiffFiles = (diffFiles: DiffFiles, diffOutput: string): DiffFiles => {
  return diffFiles.map((file) => {
    const startPattern = `diff --git a/${file.path} b/${file.path}`;
    const startIndex = diffOutput.indexOf(startPattern);

    if (startIndex === -1) {
      throw new Error(`Failed to find start pattern(${startPattern}) in diff output`);
    }

    const nextDiffIndex = diffOutput.indexOf('diff --git', startIndex + startPattern.length);

    const content = nextDiffIndex !== -1 ? diffOutput.slice(startIndex, nextDiffIndex) : diffOutput.slice(startIndex);

    return {
      path: file.path,
      name: file.name,
      content: content,
    };
  });
};
