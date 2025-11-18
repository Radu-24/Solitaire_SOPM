import Column from "./Column";
import Card from "./Card";

export default function Board({
  tableau,
  foundations,
  stock,
  waste,
  onStockClick,
  onWasteClick,
  onTableauCardClick,
  onTableauCardDoubleClick,
  onFoundationClick,
  onNewGame,
  onUndo,
}) {
  return (
    <div className="board">
      <header className="header">
        <h1>Solitaire</h1>
        <div className="controls">
          <button onClick={onNewGame}>New Game</button>
          <button onClick={onUndo}>Undo</button>
        </div>
      </header>

      <div className="top-row">
        <div className="stock-area">
          <div className="stock" onClick={onStockClick}>
            {stock.length === 0 ? <span className="placeholder">∅</span> : <span />}
          </div>
          <div className="waste">
  {waste.length > 0 && (
    <Card 
      card={waste[waste.length - 1]} 
      onClick={() => onWasteClick()} 
      onDoubleClick={() => onWasteClick()}
    />
  )}
</div>
        </div>

        <div className="foundations">
          {foundations.map((pile, index) => (
            <div
              key={index}
              className="foundation"
              onClick={() => onFoundationClick(index)}
            >
              {pile.length === 0 ? (
                <span className="placeholder">A</span>
              ) : (
                <Card card={pile[pile.length - 1]} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="tableau">
        {tableau.map((col, index) => (
          <Column
            key={index}
            cards={col}
            onCardClick={(card) => onTableauCardClick(card, index)}
            onCardDoubleClick={(card) => onTableauCardDoubleClick(card, index)}
          />
        ))}
      </div>
    </div>
  );
}