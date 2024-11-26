const mario = document.querySelector('#mario');
const pipe = document.querySelector('#pipe');
const clouds = document.querySelector('#clouds');
const container = document.querySelector('#container');
const gameOverText = document.querySelector('#game-over-text');
const gameOverScreen = document.querySelector('#game-over-screen');
const scoreElement = document.querySelector('#score');
const startScreen = document.querySelector('#start-screen');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

const isMobile = window.innerWidth <= 768;
const pipeSpeed = isMobile ? 1 : 1.2;

document.documentElement.style.setProperty('--pipe-speed', `${pipeSpeed}s`);

let score = 0;
let zerosBeforeScore = 6;
let pipePassed = false;
let hasGameStarted = false;

function jump() {
  mario.classList.add('jump');
  setTimeout(() => mario.classList.remove('jump'), 500);
}

function updateScore() {
  scoreElement.innerText = '0'.repeat(zerosBeforeScore - String(score).length) + score;
  scoreElement.classList.add('score-update');
  setTimeout(() => scoreElement.classList.remove('score-update'), 500);
}

function checkIfGameIsOver() {
  const pipePosition = pipe.offsetLeft;
  const cloudsPosition = clouds.offsetLeft;
  const marioPosition = Number(window.getComputedStyle(mario).bottom.replace('px', ''));

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    endGame(pipePosition, cloudsPosition, marioPosition);
  } else if (pipePosition < 0 && !pipePassed) {
    score += 10;
    pipePassed = true;
  } else if (pipePosition >= 120) {
    pipePassed = false;
  }
}

function endGame(pipePosition, cloudsPosition, marioPosition) {
  pipe.style.animation = 'none';
  pipe.style.left = `${pipePosition}px`;
  clouds.style.animation = 'none';
  clouds.style.left = `${cloudsPosition}px`;

  mario.style.animation = 'none';
  mario.style.bottom = `${marioPosition}px`;
  mario.src = './assets/game-over.png';
  mario.style.width = '75px';
  mario.style.marginLeft = '50px';

  checkHighestScore();
  showGameOverScreen();
}

function checkHighestScore() {
  const highestScore = localStorage.getItem('highestScore');
  if (!highestScore || score > highestScore) {
    localStorage.setItem('highestScore', score);
  }
}

function showGameOverScreen() {
  container.style.transition = 'background 2s ease';
  container.style.background = 'black';
  clouds.style.display = 'none';

  const highestScore = localStorage.getItem('highestScore');
  document.querySelector('#final-score').innerText = score;
  document.querySelector('#highest-score').innerText = highestScore;

  gameOverScreen.style.display = 'flex';
  gameOverText.style.display = 'block';
  gameOverText.style.left = `${mario.offsetLeft - 10}px`;
  gameOverText.style.top = `${mario.offsetTop - (gameOverText.offsetHeight + 10)}px`;
}

function restart() {
  container.style.transition = 'none';
  container.style.background = 'linear-gradient(#87CEEB, #E0F6FF)';

  mario.src = './assets/mario.gif';
  mario.style.animation = '';
  mario.style.bottom = '0';
  mario.style.width = '150px';
  mario.style.marginLeft = '0';

  resetElement(pipe, 'pipe-animation var(--pipe-speed, 1.5s) infinite linear');
  resetElement(clouds, 'clouds-animation 15s infinite linear');

  clouds.style.display = 'block';
  gameOverScreen.style.display = 'none';
  gameOverText.style.display = 'none';

  score = 0;
  pipePassed = false;
  scoreElement.innerText = '0'.repeat(zerosBeforeScore);

  setTimeout(() => (container.style.transition = 'background 2s ease'), 0);
}

function resetElement(element, animation) {
  element.style.animation = 'none';
  element.style.left = '';
  void element.offsetWidth;
  element.style.animation = animation;
}

function startGame() {
  startScreen.style.display = 'none';
  restart();
  hasGameStarted = true;
  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', jump);
}

function autoJumpWhenGameHasNotStarted() {
  const pipePosition = pipe.offsetLeft;
  if (
      !hasGameStarted && 
      ((isMobile && pipePosition <= 170 && pipePosition >= 0) || 
      (!isMobile && pipePosition <= 250 && pipePosition >= 0))
    ) jump();
}

setInterval(() => {
  if (!hasGameStarted) return;

  updateScore();
  checkIfGameIsOver();
}, 10);

setInterval(autoJumpWhenGameHasNotStarted, 10);

startButton.addEventListener('click', startGame);

restartButton.addEventListener('touchstart', (event) => {
  event.stopPropagation();
  restart();
});

restartButton.addEventListener('click', restart);
