import { createMachine } from 'xstate';

export const gameMachine = createMachine({
  id: 'game',
  initial: 'mainMenu',
  states: {
    mainMenu: {
      on: { START: 'battleGrid' },
    },
    battleGrid: {
      on: { END: 'gameOver' },
    },
    gameOver: {
      on: { RESTART: 'mainMenu' },
    },
  },
});

export default gameMachine;