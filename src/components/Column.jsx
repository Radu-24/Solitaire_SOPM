import Card from "./Card";

export default function Column({ cards, onCardClick, onCardDoubleClick }) {
  return (
    <div className="column">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="card-wrapper"
          style={{ top: index * 25 + "px" }}
        >
          <Card
            card={card}
            onClick={onCardClick}
            onDoubleClick={onCardDoubleClick}
          />
        </div>
      ))}
    </div>
  );
}
