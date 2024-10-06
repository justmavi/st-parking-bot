export const SceneNames = {
  ENTER_PIN: 'enterPin',
  SELECT_GATE: 'selectGate',
  OPEN_GATE: 'openGate'
} as const;

export const MAX_AUDIO_ATTACHMENT_COUNT = 10;
export const HISTORY_DATA_PREFIX = 'page_';
export const HISTORY_DATA_REGEX_PATTERN = HISTORY_DATA_PREFIX + '(\\d+)';
