import { useMemo, useState } from "react";

const suitColors = {
  "♠": "black",
  "♣": "black",
  "♥": "red",
  "♦": "red",
};

export default function Card({
  card,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragEnd,
}) {
  const { suit, value, faceDown, id } = card;
  const color = useMemo(() => suitColors[suit] || "black", [suit]);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragStart(e) {
    if (faceDown) {
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";

    setIsDragging(true);
    if (onDragStart) onDragStart(card);
  }

  function handleDragEnd(e) {
    e.stopPropagation();
    setIsDragging(false);
    if (onDragEnd) onDragEnd(card);
  }

  function handleClick(e) {
    e.stopPropagation();
    if (onClick) onClick(card);
  }

  function handleDoubleClick(e) {
    e.stopPropagation();
    if (onDoubleClick) onDoubleClick(card);
  }

  return (
    <div
      className={`card ${faceDown ? "card-back" : "card-front"} ${
        isDragging ? "dragging" : ""
      }`}
      style={{ color }}
      draggable={!faceDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-id={id}
    >
      {!faceDown && (
        <>
          <span className="corner top">
            {value}
            {suit}
          </span>
          <span className="symbol">{suit}</span>
          <span className="corner bottom">
            {value}
            {suit}
          </span>
        </>
      )}
    </div>
  );
}
