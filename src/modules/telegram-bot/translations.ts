import { GATES } from '@common/constants/app.constants';

export const GO_TO_MAIN_MENU_TEXT = "Go to main menu";

export const BotMessageTranslations = {
  start: {
    message: 'Enter the PIN code to activate bot',
    keyboard: []
  },
  incorrectPin: {
    message: 'Incorrect PIN code',
    keyboard: []
  },
  mainMenu: {
    message: 'Select the gate that you want to open',
    keyboard: GATES.map(x => [`Open ${x.name}`]),
  },

  queued: {
    message: 'Please wait...',
    keyboard: []
  },
  ringing: {
    message: 'Trying to open...',
    keyboard: []
  },
  completed: {
    message: 'Failed to open the gate...',
    keyboard: [[GO_TO_MAIN_MENU_TEXT]]
  },
  failed: {
    message: 'Failed to open the gate...',
    keyboard: [[GO_TO_MAIN_MENU_TEXT]]
  },
  busy: {
    message: 'Gate opened!',
    keyboard: [[GO_TO_MAIN_MENU_TEXT]]
  },
  'no-answer': {
    message: 'Failed to open the gate...',
    keyboard: [[GO_TO_MAIN_MENU_TEXT]]
  },
};
