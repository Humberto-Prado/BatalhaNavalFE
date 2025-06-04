import { useEffect, useState } from "react";
import "./App.css";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";
import Menu from "./Menu";
import { useMachine } from '@xstate/react';
import { gameMachine } from "./gameMachine.tsx";

function App() {
    const [wsStarted, setWsStarted] = useState(false);
    const [state, send] = useMachine(gameMachine);
   

    
    return (
    <WebSocketComponent>
      {(sendMessageFn, message) => {
        switch (state.value) {
          case "mainMenu":
            return (
              <div className="mainMenuContainer">
                <h1 className="titleMenu">Tactical Battleship</h1>
                <audio className="audio" autoPlay muted loop controls>
                  <source src="./src/assets/epic.mp3" type="audio/mp3" />
                </audio>
                <button
                  className="btnPlayMenu"
                  onClick={() => {
                    send({type: "START"});
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

          case "battleGrid":
            return (
              <>
                <div className="menuContainer">
                  <Menu
                    mWsStarted={wsStarted}
                    setmWsStarted={setWsStarted}
                    sendMessage={sendMessageFn}
                    message={message}
                    onEnd={() => send({type: "END"})}
                  />
                </div>
                {wsStarted && (
                  <div className="gridContainer">
                    <BattleGrid
                      sendMessage={sendMessageFn}
                      wsData={message}
                    />
                  </div>
                )}
              </>
            );

          case "gameOver":
            return (
              <div className="gameOverContainer">
                <h1 className="gameOver">Game Over</h1>
                <button className="btnMainMenu" onClick={() => send({type: "RESTART"})}>
                  Back to Main Menu
                </button>
              </div>
            );

          default:
            return null;
        }
      }}
    </WebSocketComponent>
  );
}
export default App;
