import { useMemo } from "react";

const suitColors = {
  "♠": "black",
  "♣": "black",
  "♥": "red",
  "♦": "red",
};

export default function Card({ card, onClick, onDoubleClick }) {
  const { suit, value, faceDown, id } = card;

  const color = useMemo(() => suitColors[suit] || "black", [suit]);

  return (
    <div
      className={`card ${faceDown ? "card-back" : "card-front"}`}
      style={{ color }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(card);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (onDoubleClick) onDoubleClick(card);
      }}
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
