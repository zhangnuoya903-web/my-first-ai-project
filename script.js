const pond = document.querySelector('#pond');
const cat = document.querySelector('#cat');
const fish = document.querySelector('#fish');
const score = document.querySelector('#score');
const message = document.querySelector('#message');
const randomFishButton = document.querySelector('#randomFish');

let caughtCount = 0;
let isCatMoving = false;

function getRandomPosition() {
  const pondRect = pond.getBoundingClientRect();
  const fishRect = fish.getBoundingClientRect();
  const padding = 36;
  const maxX = pondRect.width - fishRect.width - padding;
  const maxY = pondRect.height - fishRect.height - padding;

  return {
    x: Math.floor(padding + Math.random() * Math.max(maxX - padding, 1)),
    y: Math.floor(padding + Math.random() * Math.max(maxY - padding, 1)),
  };
}

function placeFishRandomly() {
  const position = getRandomPosition();
  fish.style.setProperty('--fish-x', `${position.x}px`);
  fish.style.setProperty('--fish-y', `${position.y}px`);
  message.textContent = '小鱼换位置啦，快点击它！';
}

function moveCatToFish() {
  if (isCatMoving) {
    return;
  }

  isCatMoving = true;
  const pondRect = pond.getBoundingClientRect();
  const fishRect = fish.getBoundingClientRect();
  const catRect = cat.getBoundingClientRect();

  const targetX = fishRect.left - pondRect.left - catRect.width * 0.2;
  const targetY = fishRect.top - pondRect.top - catRect.height * 0.35;

  cat.classList.add('running');
  cat.style.setProperty('--cat-x', `${Math.max(12, targetX)}px`);
  cat.style.setProperty('--cat-y', `${Math.max(12, targetY)}px`);
  message.textContent = '小猫出发抓鱼！';

  window.setTimeout(() => {
    cat.classList.remove('running');
    cat.classList.add('caught');
    fish.classList.add('hidden');
    caughtCount += 1;
    score.textContent = caughtCount;
    message.textContent = '抓到啦！新的小鱼出现了。';
  }, 920);

  window.setTimeout(() => {
    cat.classList.remove('caught');
    fish.classList.remove('hidden');
    placeFishRandomly();
    isCatMoving = false;
  }, 1450);
}

fish.addEventListener('click', moveCatToFish);
randomFishButton.addEventListener('click', placeFishRandomly);
window.addEventListener('load', placeFishRandomly);
window.addEventListener('resize', placeFishRandomly);
