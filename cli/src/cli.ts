import { cli } from 'cleye';
import { version, description } from '../package.json';
import { aireview, getEnv, setEnv } from './commands';

const rawArgv = process.argv.slice(2);

cli(
  {
    name: 'aireview',
    flags: {
      output: {
        type: Boolean,
        alias: 'o',
        description: 'Output Files before compression',
        default: false,
      },
      version: {
        type: Boolean,
        alias: 'v',
        description: 'Show version',
        default: false,
      },
      init: {
        type: Boolean,
        alias: 'i',
        description: 'Initialize aireview',
        default: false,
      },
      env: {
        type: Boolean,
        alias: 'e',
        description: 'Display environment variables',
        default: false,
      },
    },
    help: {
      description,
    },
  },
  (argv) => {
    if (argv.flags.version) {
      return console.log(version);
    }
    if (argv.flags.init) {
      setEnv();
      return;
    }
    if (argv.flags.env) {
      getEnv();
      return;
    }
    aireview(argv.flags.output);
  },
  rawArgv,
);
