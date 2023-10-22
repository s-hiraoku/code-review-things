import { dim } from 'kolorist';
import { version } from '../../package.json';

export class KnownError extends Error {}

const indent = '    ';
const versionMsg = `\n${indent}${dim(`aireview v${version}`)}`;
const bugReportMsg = `${indent}https://github.com/s-hiraoku/aireview/issues/new/choose`;
const promptMsg = `\n${indent}Please open a Bug report with the information above: ${bugReportMsg}`;

export const handleCliError = (error: unknown): void => {
  if (error instanceof Error && !(error instanceof KnownError)) {
    let stackTrace = '';
    if (error.stack) {
      stackTrace = dim(error.stack.split('\n').slice(1).join('\n'));
    }

    console.error(`${stackTrace}${versionMsg}${promptMsg}`);
  }
};
