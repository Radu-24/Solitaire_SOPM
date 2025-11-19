import { useEffect, useState } from "react";
import Board from "./components/Board";
import HomePage from "./HomePage";
import {
  generateDeck,
  deal,
  drawFromStock,
  moveStackInTableau,
  cloneState,
  checkWin,
  moveWasteToTableau,
  autoMoveToFoundation,
} from "./gameLogic";
import { saveGame, loadGame } from "./storage";
import { playMoveSound } from "./sound";

export default function App() {
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);
  const [dragInfo, setDragInfo] = useState(null); // { type: 'tableau'|'waste', fromColIndex?, cardId }

  // nou: controlăm dacă se vede home page
  const [showHome, setShowHome] = useState(true);
  // nou: știm dacă există un joc salvat ca să afișăm Continue
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setState(saved);
      setHasSavedGame(true);
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
    setHasSavedGame(true); // există mereu un joc curent ce poate fi „Continue”
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

  // ---- HANDLERE HOME PAGE ----
  function handleHomeNewGame() {
    startNewGame();   // folosește exact logica ta
    setShowHome(false);
  }

  function handleHomeContinue() {
    // dacă nu ai nimic salvat (teoretic nu se întâmplă), pornește un joc nou
    if (!hasSavedGame) {
      startNewGame();
    }
    setShowHome(false);
  }

  function handleHomeHistory() {
    // deocamdată doar placeholder, ca să nu stricăm nimic în gameLogic
    alert("History / CSV îl facem după ce stabilim structura datelor.");
  }

  // dacă suntem pe Home Page, nu mai randăm Board-ul
  if (showHome) {
    return (
      <HomePage
        onNewGame={handleHomeNewGame}
        onContinue={handleHomeContinue}
        onShowHistory={handleHomeHistory}
        canContinue={hasSavedGame}
      />
    );
  }

  // de aici în jos e codul tău original, aproape nemodificat

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

  // doar stock-ul mai merge pe click
  function handleStockClick() {
    updateStateWithSound((prev) => drawFromStock(prev));
  }

  // ---- DRAG & DROP TABLEAU ----
  function handleTableauDragStart(card, fromColIndex) {
    if (card.faceDown) return;
    setDragInfo({
      type: "tableau",
      fromColIndex,
      cardId: card.id,
    });
  }

  function handleTableauDrop(toColIndex) {
    if (!dragInfo || dragInfo.type !== "tableau") return;

    const { fromColIndex, cardId } = dragInfo;

    if (fromColIndex === toColIndex) {
      setDragInfo(null);
      return;
    }

    updateStateWithSound((prev) =>
      moveStackInTableau(prev, fromColIndex, cardId, toColIndex)
    );

    setDragInfo(null);
  }

  function handleDragEnd() {
    if (dragInfo) {
      setDragInfo(null);
    }
  }

  // ---- DRAG & DROP WASTE ----
  function handleWasteDragStart(card) {
    if (card.faceDown) return;

    setDragInfo({
      type: "waste",
      cardId: card.id,
    });
  }

  function handleWasteDropOnTableau(toColIndex) {
    if (!dragInfo || dragInfo.type !== "waste") return;

    const { cardId } = dragInfo;

    updateStateWithSound((prev) =>
      moveWasteToTableau(prev, cardId, toColIndex)
    );

    setDragInfo(null);
  }

  // ---- DRAG & DROP CĂTRE FOUNDATION (din waste sau tableau) ----
  function handleFoundationDrop(foundationIndex) {
    if (!dragInfo) return;

    if (dragInfo.type === "waste") {
      updateStateWithSound((prev) =>
        autoMoveToFoundation(prev, { from: "waste" }, foundationIndex)
      );
    } else if (dragInfo.type === "tableau") {
      updateStateWithSound((prev) =>
        autoMoveToFoundation(
          prev,
          { from: "tableau", colIndex: dragInfo.fromColIndex },
          foundationIndex
        )
      );
    }

    setDragInfo(null);
  }

  return (
    <Board
      tableau={tableau}
      foundations={foundations}
      stock={stock}
      waste={waste}
      onStockClick={handleStockClick}
      onNewGame={startNewGame}
      onUndo={handleUndo}
      // drag & drop tableau
      onTableauDragStart={handleTableauDragStart}
      onTableauDrop={handleTableauDrop}
      onDragEnd={handleDragEnd}
      // drag & drop waste
      onWasteDragStart={handleWasteDragStart}
      onWasteDropOnTableau={handleWasteDropOnTableau}
      // drag & drop spre foundation
      onFoundationDrop={handleFoundationDrop}
    />
  );
}
