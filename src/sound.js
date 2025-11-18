export function playMoveSound() {
  try {
    const audio = new Audio("/sounds/move.mp3");
    audio.play();
  } catch (e) {
    // ignore if sound cannot play
  }
}
