/// <reference types="node" />

// oxlint-disable-next-line import/no-nodejs-modules
import fs from 'node:fs';
// oxlint-disable-next-line import/no-nodejs-modules
import process from 'node:process';

import type { Config } from './helpers/lint-git-commit-msg';

import { validate } from './helpers/lint-git-commit-msg.ts';

const getPackageNames = (): string[] => ['apps', 'packages'].flatMap(name => fs.readdirSync(name));

const CONFIG: Config = {
  MAX_SUBJECT_LENGTH: 72,
  MAX_BODY_LINE_LENGTH: 79,
  ALLOWED_TYPES: new Set([
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'perf',
    'test',
    'build',
    'ci',
    'chore',
    'revert'
  ]),
  ALLOWED_SCOPES: new Set(getPackageNames())
} as const;

const result = validate(fs.readFileSync(0, 'utf8'), CONFIG);

if (result.error !== undefined) {
  process.stderr.write(`ERROR: ${result.error}\n`);
}

// oxlint-disable-next-line unicorn/no-process-exit
process.exit(result.exit);
