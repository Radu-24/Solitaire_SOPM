import { useState } from "react";
import Card from "./Card";

export default function Column({
  columnIndex,
  cards,
  onCardClick,
  onCardDoubleClick,
  onCardDragStart,
  onCardDragEnd,
  onDropOnColumn,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (onDropOnColumn) onDropOnColumn(columnIndex);
  }

  return (
    <div
      className={`column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="card-wrapper"
          style={{ top: `${index * 30}px` /* era 25, acum mai aerisit */ }}
        >
          <Card
            card={card}
            onClick={onCardClick}
            onDoubleClick={onCardDoubleClick}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
          />
        </div>
      ))}
    </div>
  );
}
