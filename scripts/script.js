const mario = document.querySelector('#mario');
const pipe = document.querySelector('#pipe');
const clouds = document.querySelector('#clouds');

const isMobile = window.innerWidth <= 768;
const pipeSpeed = isMobile ? 1 : 1.2;

document.documentElement.style.setProperty('--pipe-speed', `${pipeSpeed}s`);

let score = 0;
let zerosBeforeScore = 6;
let pipePassed = false;

function jump() {
  mario.classList.add('jump');

  setTimeout(() => mario.classList.remove('jump'), 500);
}

function checkIfGameIsOver() {
  const pipePosition = pipe.offsetLeft;
  const cloudsPosition = clouds.offsetLeft;
  const marioPosition = Number(window.getComputedStyle(mario).bottom.replace('px', ''));

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
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
  } else if (pipePosition < 0 && !pipePassed) {
    score += 10;
    pipePassed = true;
  } else if (pipePosition >= 120) {
    pipePassed = false;
  }
}

function checkHighestScore() {
  const highestScore = localStorage.getItem('highestScore');

  if (!highestScore || score > highestScore)
    localStorage.setItem('highestScore', score);
}

function showGameOverScreen() {
  const container = document.querySelector('#container');
  container.style.transition = 'background 2s ease';
  container.style.background = 'black';
  clouds.style.display = 'none';
  
  const gameOverText = document.querySelector('#game-over-text');
  const gameOverScreen = document.querySelector('#game-over-screen');
  const highestScore = localStorage.getItem('highestScore');

  document.querySelector('#final-score').innerText = score;
  document.querySelector('#highest-score').innerText = highestScore;

  gameOverScreen.style.display = 'flex';

  gameOverText.style.display = 'block';
  gameOverText.style.left = `${mario.offsetLeft - 10}px`;
  gameOverText.style.top = `${mario.offsetTop - (gameOverText.offsetHeight + 10)}px`;
}

function restart() {
  const gameOverScreen = document.querySelector('#game-over-screen');
  const container = document.querySelector('#container');
  const gameOverText = document.querySelector('#game-over-text');

  container.style.transition = 'none';
  container.style.background = 'linear-gradient(#87CEEB, #E0F6FF)';

  mario.src = './assets/mario.gif';
  mario.style.animation = '';
  mario.style.bottom = '0';
  mario.style.width = '150px';
  mario.style.marginLeft = '0';

  pipe.style.animation = 'none';
  pipe.style.left = '';
  void pipe.offsetWidth;
  document.documentElement.style.setProperty('--pipe-speed', `${pipeSpeed}s`);
  pipe.style.animation = 'pipe-animation var(--pipe-speed, 1.5s) infinite linear';

  clouds.style.animation = 'none';
  clouds.style.left = '';
  void clouds.offsetWidth;
  clouds.style.animation = 'clouds-animation 15s infinite linear';

  clouds.style.display = 'block';

  gameOverScreen.style.display = 'none';
  gameOverText.style.display = 'none';

  score = 0;
  pipePassed = false;

  const scoreElement = document.querySelector('#score');
  scoreElement.innerText = '0'.repeat(zerosBeforeScore);

  setTimeout(() => (container.style.transition = 'background 2s ease'), 0);
}

setInterval(() => {
  const scoreElement = document.querySelector('#score');
  scoreElement.innerText = '0'.repeat(zerosBeforeScore - String(score).length) + score;
  scoreElement.classList.add('score-update');

  setTimeout(() => scoreElement.classList.remove('score-update'), 500);
  checkIfGameIsOver();
}, 10);

document.addEventListener('keydown', jump);