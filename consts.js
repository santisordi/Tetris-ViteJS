//construyo tablero de tetris
export const BLOCK_SIZE = 20;
export const BOARD_WIDTH = 14;
export const BOARD_HEIGHT = 30;

export const event_movments = {
    LEFT: 'ArrowLeft',
    DOWN: 'ArrowDown',
    RIGHT: 'ArrowRight'
};

// pauseLogic.js
export let isGamePaused = false;

export function togglePause(pauseLabel, pauseButton) {
   isGamePaused = !isGamePaused;

   if (isGamePaused) {
      pauseLabel.innerText = 'Game Paused';
   } else {
      pauseLabel.innerText = '';
   }

   pauseButton.innerText = isGamePaused ? 'Resume' : 'Pause';
}