const isLowerCase = (value: string): boolean => value.toLowerCase() === value;

// Written by Gemma 4 31B, modified to fix lint warnings

const HEADER_REGEX = /^(?<type>[a-zA-Z]+)(?:\((?<scope>[a-zA-Z0-9-]+)\))?(?<breaking>!)?: (?<description>.+)$/u;

export type Config = {
  readonly MAX_SUBJECT_LENGTH: number;
  readonly MAX_BODY_LINE_LENGTH: number;
  readonly ALLOWED_TYPES: Set<string>;
  readonly ALLOWED_SCOPES: Set<string>;
};

export type ProcessExit = {
  exit: 0 | 1;
  error?: string;
};

const error = (message: string): ProcessExit => ({
  exit: 1,
  error: message
});

export const validate = (content: string, config: Config): ProcessExit => {
  const lines = content.split(/\n/u).map(l => l.trimEnd());
  const [header, blank, ...body] = lines;

  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (!header) {
    return error('commit message is empty');
  }

  if (header.length > config.MAX_SUBJECT_LENGTH) {
    return error(`header exceeds ${config.MAX_SUBJECT_LENGTH} characters`);
  }

  const groups = HEADER_REGEX.exec(header)?.groups;

  if (!groups) {
    return error("header must match '<type>[(<scope>)][!]: <description>'");
  }

  const { type, scope, description } = groups;

  if (type !== undefined && !config.ALLOWED_TYPES.has(type)) {
    return error(`type '${type}' is not allowed; allowed types: ${[...config.ALLOWED_TYPES].join(', ')}`);
  }

  if (scope !== undefined && !config.ALLOWED_SCOPES.has(scope)) {
    return error(`scope '${scope}' is not allowed; allowed scopes: ${[...config.ALLOWED_SCOPES].join(', ')}`);
  }

  if (description !== undefined) {
    if (description.endsWith('.')) {
      return error('description must not end with a period');
    }

    if (description.length > 0 && !isLowerCase(description[0]!)) {
      return error('description must start with a lower case character');
    }
  }

  if (blank !== undefined && blank !== '') {
    return error('blank line required between header and body');
  }

  for (const [index, line] of body.entries()) {
    if (line && line.length > config.MAX_BODY_LINE_LENGTH) {
      return error(`body line ${index + 3} exceeds ${config.MAX_BODY_LINE_LENGTH} characters`);
    }
  }

  return { exit: 0 };
};
