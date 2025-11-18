let nextId = 1;
const valueOrder = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const suits = ["♠", "♥", "♦", "♣"];
const foundationSuits = ["♥", "♦", "♣", "♠"];

export function generateDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of valueOrder) {
      deck.push({
        id: nextId++,
        suit,
        value,
        faceDown: true,
      });
    }
  }
  return shuffle(deck);
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function deal(deck) {
  const tableau = [[], [], [], [], [], [], []];
  const newDeck = [...deck];

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = newDeck.pop();
      if (row === col) card.faceDown = false;
      tableau[col].push(card);
    }
  }

  newDeck.forEach((c) => (c.faceDown = true));

  return {
    tableau,
    foundations: [[], [], [], []],
    stock: newDeck,
    waste: [],
  };
}

const colors = {
  "♠": "black",
  "♣": "black",
  "♥": "red",
  "♦": "red",
};

export function canPlaceOnTableau(card, targetPile) {
  if (targetPile.length === 0) {
    return card.value === "K";
  }
  const top = targetPile[targetPile.length - 1];
  return (
    colors[card.suit] !== colors[top.suit] &&
    valueOrder.indexOf(card.value) + 1 === valueOrder.indexOf(top.value)
  );
}

// foundationIndex spune ce suit are casa (♥, ♦, ♣, ♠ în ordinea foundationSuits)
export function canPlaceOnFoundation(card, pile, pileIndex) {
  const requiredSuit = foundationSuits[pileIndex];

  if (card.suit !== requiredSuit) return false;

  if (pile.length === 0) {
    return card.value === "A";
  }

  const top = pile[pile.length - 1];
  return (
    card.suit === top.suit &&
    valueOrder.indexOf(card.value) === valueOrder.indexOf(top.value) + 1
  );
}

// dacă foundationIndex e null → caută orice foundation valid (folosit doar dacă vrei auto)
export function autoMoveToFoundation(state, cardLocation, foundationIndex = null) {
  const newState = cloneState(state);
  let card = null;

  if (cardLocation.from === "waste") {
    card = newState.waste[newState.waste.length - 1];
    if (!card) return state;
  } else if (cardLocation.from === "tableau") {
    const col = newState.tableau[cardLocation.colIndex];
    card = col[col.length - 1];
    if (!card || card.faceDown) return state;
  }

  const indicesToTry =
    foundationIndex !== null
      ? [foundationIndex]
      : newState.foundations.map((_, i) => i);

  for (let i of indicesToTry) {
    const pile = newState.foundations[i];
    if (canPlaceOnFoundation(card, pile, i)) {
      if (cardLocation.from === "waste") {
        newState.waste.pop();
      } else {
        newState.tableau[cardLocation.colIndex].pop();
        flipLastInColumn(newState.tableau[cardLocation.colIndex]);
      }
      pile.push(card);
      return newState;
    }
  }

  return state;
}

// folosit înainte pe click – poate rămâne
export function moveFromWasteToTableau(state, colIndex) {
  const newState = cloneState(state);
  const card = newState.waste[newState.waste.length - 1];
  if (!card) return state;

  if (!canPlaceOnTableau(card, newState.tableau[colIndex])) {
    return state;
  }

  newState.waste.pop();
  newState.tableau[colIndex].push(card);
  return newState;
}

export function moveStackInTableau(state, fromCol, cardId, toCol) {
  const newState = cloneState(state);
  const source = newState.tableau[fromCol];
  const target = newState.tableau[toCol];

  const index = source.findIndex((c) => c.id === cardId);
  if (index === -1) return state;

  const movingStack = source.slice(index);
  if (movingStack[0].faceDown) return state;

  if (!canPlaceOnTableau(movingStack[0], target)) return state;

  newState.tableau[fromCol] = source.slice(0, index);
  newState.tableau[toCol] = [...target, ...movingStack];

  flipLastInColumn(newState.tableau[fromCol]);

  return newState;
}

export function drawFromStock(state) {
  const newState = cloneState(state);

  if (newState.stock.length === 0) {
    newState.stock = newState.waste.map((c) => ({ ...c, faceDown: true }));
    newState.waste = [];
    return newState;
  }

  const card = newState.stock[newState.stock.length - 1];
  card.faceDown = false;
  newState.stock.pop();
  newState.waste.push(card);
  return newState;
}

export function checkWin(state) {
  return state.foundations.every((pile) => pile.length === 13);
}

function flipLastInColumn(col) {
  if (col.length === 0) return;
  const last = col[col.length - 1];
  if (last.faceDown) last.faceDown = false;
}

export function cloneState(state) {
  return {
    tableau: state.tableau.map((col) => col.map((c) => ({ ...c }))),
    foundations: state.foundations.map((pile) => pile.map((c) => ({ ...c }))),
    stock: state.stock.map((c) => ({ ...c })),
    waste: state.waste.map((c) => ({ ...c })),
  };
}

// DnD: WASTE -> TABLEAU
export function moveWasteToTableau(state, cardId, toColIndex) {
  const newState = cloneState(state);

  if (newState.waste.length === 0) return state;

  const card = newState.waste[newState.waste.length - 1];

  if (card.id !== cardId) return state;

  const targetPile = newState.tableau[toColIndex];

  if (!canPlaceOnTableau(card, targetPile)) {
    return state;
  }

  newState.waste.pop();
  targetPile.push(card);

  return newState;
}
