import { useEffect, useState } from "react";
import Board from "./components/Board";
import {
  generateDeck,
  deal,
  drawFromStock,
  moveFromWasteToTableau,
  moveStackInTableau,
  autoMoveToFoundation,
  cloneState,
  checkWin,
} from "./gameLogic";
import { saveGame, loadGame } from "./storage";
import { playMoveSound } from "./sound";

export default function App() {
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setState(saved);
    } else {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    if (state) {
      saveGame(state);
      if (checkWin(state)) {
        alert("Ai câștigat!");
      }
    }
  }, [state]);

  function startNewGame() {
    const deck = generateDeck();
    const newState = deal(deck);
    setState(newState);
    setHistory([]);
  }

  function pushHistory(prev) {
    setHistory((h) => [...h, cloneState(prev)]);
  }

  function handleUndo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setState(last);
      return h.slice(0, -1);
    });
  }

  if (!state) return null;

  const { tableau, foundations, stock, waste } = state;

  function updateStateWithSound(updater) {
    setState((prev) => {
      const newState = updater(prev);
      if (newState !== prev) {
        playMoveSound();
        pushHistory(prev);
      }
      return newState;
    });
  }

  function handleStockClick() {
    updateStateWithSound((prev) => drawFromStock(prev));
  }

  function handleWasteClick() {
  updateStateWithSound((prev) => {
    // 1. Încearcă auto-move în foundation
    const moved = autoMoveToFoundation(prev, { from: "waste" });
    if (moved !== prev) return moved;

    // 2. Dacă nu merge în foundation, încearcă fiecare coloană
    for (let col = 0; col < prev.tableau.length; col++) {
      const test = moveFromWasteToTableau(prev, col);
      if (test !== prev) return test;
    }

    return prev;
  });
}

  function handleTableauCardClick(card, colIndex) {
    updateStateWithSound((prev) => {
      for (let i = 0; i < prev.tableau.length; i++) {
        if (i === colIndex) continue;
        const newS = moveStackInTableau(prev, colIndex, card.id, i);
        if (newS !== prev) return newS;
      }
      return prev;
    });
  }

  function handleTableauCardDoubleClick(card, colIndex) {
    updateStateWithSound((prev) =>
      autoMoveToFoundation(prev, { from: "tableau", colIndex })
    );
  }

  function handleFoundationClick(index) {
    updateStateWithSound((prev) =>
      autoMoveToFoundation(prev, { from: "waste" })
    );
  }

  return (
    <Board
      tableau={tableau}
      foundations={foundations}
      stock={stock}
      waste={waste}
      onStockClick={handleStockClick}
      onWasteClick={handleWasteClick}
      onTableauCardClick={handleTableauCardClick}
      onTableauCardDoubleClick={handleTableauCardDoubleClick}
      onFoundationClick={handleFoundationClick}
      onNewGame={startNewGame}
      onUndo={handleUndo}
    />
  );
}