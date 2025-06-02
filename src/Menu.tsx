import { useState } from "react";

import "./App.css";

interface MenuProps {
  mWsStarted: boolean
  setmWsStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

function Menu({mWsStarted, setmWsStarted}: MenuProps) {
  
  const startGame = () => setmWsStarted(true);

  const endGame = () => setmWsStarted(false);

  return (
    <>
      <div className="title">
        <h1 className="titleText">Batalha Naval</h1>
      </div>

      <div className="sideMenu">
        <h1 className="sideMenuTitle">Side Menu</h1>
        {!mWsStarted ? (
          <button className="startBtn" onClick={startGame}>
            ▶️ Start Game
          </button>
        ) : (
          <button className="endBtn" onClick={endGame}>
            ⛔ End Game
          </button>
        )}
      </div>
      
    </>
  );
}

export default Menu;
