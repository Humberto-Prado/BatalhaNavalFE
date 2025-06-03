import { useState } from "react";
import "./App.css";
import BattleGrid from "./components/battleGrid";
import WebSocketComponent from "./components/websocket";
import Menu from "./Menu";

function App() {

    const [wsStarted, setWsStarted] = useState(false);
    const [page, setPages] = useState<string[]>(["mainMenu", "battleGrid", "gameOver"]);

    const activePage = page[0];
    console.log(activePage);

    
    if (activePage === "mainMenu") {
        return (
            <div className="mainMenuContainer">
                <h1 className="titleMenu">Tactical Battleship</h1>
                <button className="btnPlayMenu" onClick={() => setPages(["battleGrid"])}>CASUAL</button>
                <button className="btnPlayMenu" >RANKED</button>
                <button className="btnPlayMenu" >TUTORIAL</button>
                <button className="btnPlayMenu" >CLASSES</button>
                <button className="btnPlayMenu" >DONATE</button>
            </div>
        );
    } else if (activePage === "battleGrid") {
        return (
            <>
                <div className="menuContainer">
                    <Menu mWsStarted={wsStarted} setmWsStarted={setWsStarted} page={page} setPages={setPages}/>
                </div>

                {wsStarted ? (
                    
                    <div className="gridContainer">
                        <WebSocketComponent>
                            {(sendMessage, message) => (
                                <BattleGrid sendMessage={sendMessage} wsData={message} />
                            )}
                        </WebSocketComponent>
                    </div>
                ) : null}
            </>
        );
    } else if (activePage === "gameOver") {
        return (
            <div className="gameOverContainer">
                <h1 className="gameOver">Game Over</h1>
                <button className="btnMainMenu" onClick={() => setPages(["mainMenu"])}>Back to Main Menu</button>
            </div>
        );
    }
}

export default App;
