import { createMachine, assign } from "xstate";

interface GameContext {
  turn: number;
}

type GameEvent =
  | { type: "START" }
  | { type: "MATCH_FOUND" }
  | { type: "SHIPS_PLACED" }
  | { type: "NEXT_TURN" }
  | { type: "END_GAME" }
  | { type: "RESTART" };

export const gameMachine = createMachine({
  /** ✅ Definindo os tipos corretamente para XState 5 */
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },

  id: "game",
  initial: "mainMenu",
  context: {
    turn: 1,
  },
  states: {
    mainMenu: {
      on: {
        START: "battleGrid.queue",
      },
    },

    battleGrid: {
      initial: "queue",
      states: {
        queue: {
          on: {
            MATCH_FOUND: "placingShips",
          },
        },
        placingShips: {
          on: {
            SHIPS_PLACED: "playing",
          },
        },
        playing: {
          on: {
            NEXT_TURN: {
              actions: assign({
                turn: ({ context }) => context.turn + 1,
              }), 
            },
            END_GAME: "#game.gameOver",
          },
        },
      },
    },

    gameOver: {
      id: "gameOver",
      on: {
        RESTART: {
          target: "mainMenu",
          actions: assign({
            turn: () => 1,
          }),
        },
      },
    },
  },
});

export default gameMachine;