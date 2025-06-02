import { useState } from "react";
import "./App.css";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";

function App() {
  const [wsStarted, setWsStarted] = useState(false);

  const handleMessage = (data: any) => {
    console.log("📬 Mensagem do servidor:", data);
  };

  const startGame = () => setWsStarted(true);

  const endGame = () => setWsStarted(false);

  return (
    <>
      <div className="title">
        <h1 className="titleText">Batalha Naval</h1>
      </div>

      <div className="sideMenu">
        <h1 className="sideMenuTitle">Side Menu</h1>
        {!wsStarted ? (
          <button className="startBtn" onClick={startGame}>
            ▶️ Start Game
          </button>
        ) : (
          <button className="endBtn" onClick={endGame}>
            ⛔ End Game
          </button>
        )}
      </div>

      <div className="gridContainer">
        {wsStarted && (
          <WebSocketComponent onMessage={handleMessage}>
            {(sendMessage) => <BattleGrid sendMessage={sendMessage} />}
          </WebSocketComponent>
        )}
      </div>
    </>
  );
}

export default App;
