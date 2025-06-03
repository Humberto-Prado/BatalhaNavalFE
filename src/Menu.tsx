import "./App.css";

interface MenuProps {
    mWsStarted: boolean
    setmWsStarted: React.Dispatch<React.SetStateAction<boolean>>;
    setPages?: React.Dispatch<React.SetStateAction<string[]>>;
    page?: string[];

}

function Menu({ mWsStarted, setmWsStarted, page, setPages }: MenuProps) {

    const startGame = () => setmWsStarted(true);
    const endGame = () => setmWsStarted(false);
    const gameOver = () => setPages && setPages(["gameOver"])

    return (
        <>
            <div className="title">
                <h1 className="titleText">Tactical Battleship</h1>
            </div>

            <div className="sideMenu">
                <h1 className="sideMenuTitle">Side Menu</h1>
                {!mWsStarted ? (
                    <button className="startBtn" onClick={startGame}>
                        ▶️ Start Game
                    </button>
                ) : (
                    <button className="endBtn" onClick={() => { endGame(); gameOver(); }}>
                        ⛔ End Game
                    </button>
                )}
            </div>

        </>
    );
}

export default Menu;
