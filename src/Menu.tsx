import "./App.css";

interface MenuProps {
    mWsStarted: boolean
    setmWsStarted: React.Dispatch<React.SetStateAction<boolean>>;
    onEnd?: () => void;
    sendMessage?: ((msg: any) => void) | null;
    message?: any;
}

function Menu({ mWsStarted, setmWsStarted, sendMessage, message, onEnd }: MenuProps) {

    const startGame = () => setmWsStarted(true);
    const endGame = () => {
    setmWsStarted(false);
    if (onEnd) onEnd(); // dispara transição
  };

    

    return (
        <>
            <div className="title">
                <h1 className="titleText">Tactical Battleship</h1>
            </div>

            <div className="sideMenu">
                <h1 className="sideMenuTitle">Side Menu</h1>
                {!mWsStarted ? (
                    <button className="startBtn" onClick={startGame}>
                        Start Game
                    </button>
                ) : (
                    <button className="endBtn" onClick={() => { endGame(); endGame(); }}>
                        End Game
                    </button>
                )}
            </div>

        </>
    );
}

export default Menu;
