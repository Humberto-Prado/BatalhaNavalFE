import { useState } from "react";
import "./App.css";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";
import Menu from "./Menu";

function App() {
    const [wsStarted, setWsStarted] = useState(false);

    return (
        <>

            <div className="menuContainer">
                <Menu mWsStarted={wsStarted} setmWsStarted={setWsStarted} />

            </div>

            <div className="gridContainer">
                {wsStarted && (
                    <WebSocketComponent>
                        {(sendMessage, message) => (
                            <BattleGrid sendMessage={sendMessage} wsData={message} />
                        )}
                    </WebSocketComponent>
                )}
            </div>

        </>
    );
}

export default App;
