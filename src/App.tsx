import { useState } from "react";
import "./App.css";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";
import Menu from "./Menu";
import { useMachine } from "@xstate/react";
import { gameMachine } from "./gameMachine";

function App() {
  const [wsStarted, setWsStarted] = useState(false);
  const [state, send] = useMachine(gameMachine);
  const [turn, setTurn] = useMachine(gameMachine);

return (
    <WebSocketComponent>
      {(sendMessageFn, message) => {
        // Menu Principal
        if (state.matches("mainMenu")) {
          return (
            <div className="mainMenuContainer">
              <h1 className="titleMenu">Tactical Battleship</h1>
              <audio className="audio" autoPlay muted loop controls>
                <source src="./src/assets/epic.mp3" type="audio/mp3" />
              </audio>
              <button
                className="btnPlayMenu"
                onClick={() => {
                  send({ type: "START" });
                  sendMessageFn({
                    action: "join_queue",
                    type_game: "casual",
                    player_id: 1,
                  });
                }}
              >
                CASUAL
              </button>
              <button className="btnPlayMenu">RANKED</button>
              <button className="btnPlayMenu">TUTORIAL</button>
              <button className="btnPlayMenu">CLASSES</button>
              <button className="btnPlayMenu">DONATE</button>
            </div>
          );
        }

        // Game Over
        if (state.matches("gameOver")) {
          return (
            <div className="gameOverContainer">
              <h1 className="gameOver">Game Over</h1>
              <button
                className="btnMainMenu"
                onClick={() => {
                  send({ type: "RESTART" });
                }}
              >
                Back to Main Menu
              </button>
            </div>
          );
        }

        // BattleGrid + subestágios
        if (state.matches("battleGrid")) {
          return (
            <>
              <div className="menuContainer">
                <Menu
                  mWsStarted={wsStarted}
                  setmWsStarted={setWsStarted}
                  sendMessage={sendMessageFn}
                  message={message}
                  onEnd={() => send({ type: "END_GAME" })}
                />
                <button className="nextTurnButton" onClick={() => send({ type: "NEXT_TURN" })}>

                </button>
              </div>

              <div className="gridContainer">
                {state.matches({ battleGrid: "queue" }) && (
                  <>
                    <button onClick={() => send({ type: "MATCH_FOUND" })}>
                      Encontrar partida
                    </button>
                    <p>⌛ Aguardando jogador...</p>
                  </>
                )}
                {state.matches({ battleGrid: "placingShips" }) && (
                  <>
                    <p>🚢 Posicionando navios...</p>
                    <button onClick={() => send({ type: "SHIPS_PLACED" })}>
                      Pronto
                    </button>
                  </>
                )}
                {state.matches({ battleGrid: "playing" }) && (
                  <>
                    <p>🎯 Turno atual: {state.context.turn}</p>
                    
                  </>
                )}

                {wsStarted && (
                  <BattleGrid
                    sendMessage={sendMessageFn}
                    wsData={message}
                    onNextTurn={() => send({ type: "NEXT_TURN" })}
                    onGameOver={() => send({ type: "END_GAME" })}
                  />
                )}
              </div>
            </>
          );
        }

        return null;
      }}
    </WebSocketComponent>
  );
}

export default App;
