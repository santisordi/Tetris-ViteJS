
import './style.css'
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, event_movments } from './consts';
import { isGamePaused, togglePause } from './consts';

//inicializar canvast canvas = document.querySelector ('canvas');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const $score =  document.querySelector('span');
const pauseLabel = document.getElementById('pauseLabel');
const pauseButton = document.getElementById('pauseButton');

let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function createBoard ( width, height){  
  return Array(height).fill().map(()=> Array(width).fill(0));
};
//Pieza Player
const piece = {
  position: {x:5, y:5},
  shape: [
    [1, 1],
    [1, 1]
  ]
};

// Piezas random
const pieces = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
]

pauseButton.addEventListener('click', () => {
  togglePause(pauseLabel, pauseButton);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
     togglePause(pauseLabel, pauseButton);
  }
});

// Game loop y dropdown.
let dropCounter = 0;
let lastTime = 0;

function update (time = 0) { //esta es la que llamamos cada vez que inicializamos el juego
  if(!isGamePaused) {

    const deltaTime = time - lastTime;
    lastTime = time;
  
    dropCounter += deltaTime;
  
    if (dropCounter > 1000) {
      piece.position.y++;
      dropCounter = 0;
      
      if(checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        removeRows();
      };
    };
  }

  draw();
  window.requestAnimationFrame(update);
};

function draw() {
  context.fillStyle = '#000'; 
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1){
        context.fillStyle = 'green';
        context.fillRect(x, y, 1, 1 );
      };
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value){
        context.fillStyle = 'red';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1 );
      };
    });
  });
  $score.innerText = score;
};

//configuracion para mover la pieza
document.addEventListener('keydown', event => {
  if (event.key == event_movments.LEFT) 
    piece.position.x--
    if (checkCollision()){
      piece.position.x++
    };
  if (event.key == event_movments.RIGHT) 
    piece.position.x++
    if (checkCollision()){
    piece.position.x--
  };
  if (event.key == event_movments.DOWN) 
    piece.position.y++
    if (checkCollision()){
      piece.position.y--
      //solidificamos la pieza
      solidifyPiece();
      //borramos la linea
      removeRows();
    };

    if (event.key == 'ArrowUp') {
      const rotated = [];

      for (let i = 0; i < piece.shape[0].length; i++) {
        const row = [];

        for (let j = piece.shape.length - 1; j >= 0; j--) {
          row.push(piece.shape[j][i]);
        };       
        rotated.push(row);
      };
      //develvo la pieza rotada y que no se bugee en los bordes
      const previousShape = piece.shape;
      piece.shape = rotated;
      if(checkCollision()){
        piece.shape = previousShape;
      };
    };
});

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value != 0 && //puede ser undefine y los laterales tenemos que mirarlos 
        board[y + piece.position.y]?.[x + piece.position.x] != 0 
      );
    });
  });
};

function solidifyPiece() {
    piece.shape.forEach((row, y) => {
       row.forEach((value, x) => {
        if(value == 1) 
        board[ y + piece.position.y][x + piece.position.x] = 1;
      });
    });
      
      // reset position 
      piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
      piece.position.y = 0;
      
      // get random shape
      piece.shape = pieces[Math.floor(Math.random() * pieces.length)];

      //Game Over
      if(checkCollision()){
        window.alert('GAME OVER')
        board.forEach((row) => row.fill(0)); 
      };
    };
function removeRows() {
  const rowsToRemove = [];
  
  board.forEach((row, y) => {
    if(row.every(value => value == 1)) {
      rowsToRemove.push(y);
    };
  });
  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow)
    score += 10;
  });
};

let isGameMuted = false;

const muteButton = document.getElementById('muteButton');
const audio = new Audio('./tetris.mp3');
audio.volume = 0.3;

muteButton.addEventListener('click', () => {
   toggleMute();
});

function toggleMute() {
   isGameMuted = !isGameMuted;

   if (isGameMuted) {
      audio.volume = 0;
   } else {
      audio.volume = 0.3;
   };

   // Toggle button text
   muteButton.innerText = isGameMuted ? 'Unmute' : 'Mute';
};

const $section = document.querySelector('section');
$section.addEventListener('click', () => {
   update();
   $section.remove();
   audio.play();
});

