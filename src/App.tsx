import { useState } from "react";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";
import Menu from "./Menu";
import "./App.css";

function App() {

  const handleMessage = (data: any) => {
    console.log("📬 Mensagem do servidor:", data);
  };

  const [wsStarted, setWsStarted] = useState(false);

  return (
    <>
      
    <div className="menuContainer">
     <Menu mWsStarted={wsStarted} setmWsStarted={setWsStarted}/>
       
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
