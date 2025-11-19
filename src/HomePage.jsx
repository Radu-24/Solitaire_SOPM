// src/HomePage.jsx
import React from 'react';
import './index.css';

function HomePage({ onNewGame, onContinue, onShowHistory }) {
  // deocamdată afișăm mereu Continue; logica reală o legăm mai târziu
  const canContinue = true;

  return (
    <div className="home-page">
      <div className="home-inner">
        <div className="home-logo">Solitaire — SOPM</div>

        <h1 className="home-title">
          One more game?
        </h1>
        <p className="home-subtitle">
          Smooth Klondike, custom UI / UX &amp; animations by you.
        </p>

        <div className="home-buttons">
          <button className="home-btn home-btn-primary" onClick={onNewGame}>
            New Game
          </button>

          {canContinue && (
            <button className="home-btn home-btn-secondary" onClick={onContinue}>
              Continue
            </button>
          )}

          <button className="home-btn home-btn-ghost" onClick={onShowHistory}>
            History (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
