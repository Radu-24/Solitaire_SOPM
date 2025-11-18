import Column from "./Column";
import Card from "./Card";

const foundationSuits = ["♥", "♦", "♣", "♠"];

export default function Board({
  tableau,
  foundations,
  stock,
  waste,
  onStockClick,
  onNewGame,
  onUndo,
  onTableauDragStart,
  onTableauDrop,
  onDragEnd,
  onWasteDragStart,
  onWasteDropOnTableau,
  onFoundationDrop,
}) {
  // ultimele 3 cărți din waste, ca la Google (suprapuse)
  const wasteToShow = waste.slice(-3);

  return (
    <div className="board">
      <header className="header">
        <h1 className="title">Solitaire</h1>
        <div className="controls">
          <button className="control-btn" onClick={onNewGame}>
            New Game
          </button>
          <button className="control-btn" onClick={onUndo}>
            Undo
          </button>
        </div>
      </header>

      <div className="top-row">
        <div className="stock-area">
          {/* STOCK: teanc care se golește vizual */}
          <div
            className={`stock ${
              stock.length === 0 ? "stock-empty" : "stock-has-cards"
            }`}
            onClick={onStockClick}
          >
            {stock.length > 0 && <div className="stock-top-card" />}
          </div>

          {/* WASTE: ultimele 3 cărți, ușor suprapuse */}
          <div
            className="waste"
            onDragOver={(e) => e.preventDefault()}
          >
            {wasteToShow.map((card, idx) => {
              const isTop = idx === wasteToShow.length - 1;
              return (
                <div
                  key={card.id}
                  className={`waste-card-slot ${
                    isTop ? "waste-top" : "waste-under"
                  }`}
                  style={{ left: idx * 22 }}
                >
                  <Card
                    card={card}
                    onClick={undefined}
                    onDoubleClick={undefined}
                    onDragStart={isTop ? onWasteDragStart : undefined}
                    onDragEnd={isTop ? onDragEnd : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* FOUNDATIONS cu iconițe faint pe fiecare suit */}
        <div className="foundations">
          {foundations.map((pile, index) => {
            const suitSymbol = foundationSuits[index];

            return (
              <div
                key={index}
                className="foundation"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  onFoundationDrop && onFoundationDrop(index)
                }
              >
                {pile.length === 0 ? (
                  <span
                    className={`placeholder-suit placeholder-suit-${index}`}
                  >
                    {suitSymbol}
                  </span>
                ) : (
                  <Card card={pile[pile.length - 1]} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TABLEAU */}
      <div className="tableau">
        {tableau.map((col, index) => (
          <Column
            key={index}
            columnIndex={index}
            cards={col}
            onCardClick={undefined}
            onCardDoubleClick={undefined}
            onCardDragStart={(card) =>
              onTableauDragStart && onTableauDragStart(card, index)
            }
            onCardDragEnd={onDragEnd}
            onDropOnColumn={() => {
              if (onTableauDrop) onTableauDrop(index);
              if (onWasteDropOnTableau) onWasteDropOnTableau(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
