import "./App.css";
import gameMachine from "./gameMachine";
import { useMachine } from "@xstate/react";
import type { EventFrom } from "xstate";

interface MenuProps {
    mWsStarted: boolean
    setmWsStarted: React.Dispatch<React.SetStateAction<boolean>>;
    onEnd?: () => void;
    sendMessage?: ((msg: any) => void) | null;
    message?: any;
    send: (event: EventFrom<typeof gameMachine>) => void;
    currentTurn: number;
}

function Menu({ mWsStarted, setmWsStarted, sendMessage, message, onEnd, send }: MenuProps) {

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
                <button
                    className="startBtn"
                    onClick={() => {
                        if (sendMessage) {
                            sendMessage({
                                action: "get_game_info",
                                game_id: 1,
                                player_id: 1,
                                type_game: "casual",
                            });
                        }
                    send({ type: "START" });
                    setmWsStarted(true);
                    }}
                >
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
