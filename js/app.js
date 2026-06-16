const state = { date: null, food: null, dress: null };

const BG_EMOJIS = ['🌸', '💕', '✨', '🌷', '💗', '🦋', '🌹', '💖', '🎀', '💝', '🌺', '💫'];
const CONFETTI_EMOJIS = ['🎉', '💕', '🌸', '✨', '🎊', '💗', '🌷', '🦋', '🎀', '💝', '🌺', '💫'];
const HEART_EMOJIS = ['💕', '💗', '💖', '✨'];

function initFloatingBackground() {
  const container = document.getElementById('floatBg');
  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span');
    span.textContent = BG_EMOJIS[Math.floor(Math.random() * BG_EMOJIS.length)];
    span.style.left = `${Math.random() * 98}vw`;
    span.style.animationDuration = `${8 + Math.random() * 14}s`;
    span.style.animationDelay = `${Math.random() * -20}s`;
    span.style.fontSize = `${18 + Math.random() * 22}px`;
    container.appendChild(span);
  }
}

function dodgeNo(event) {
  const btn = document.getElementById('noBtn');
  const row = document.getElementById('askRow');
  const rowRect = row.getBoundingClientRect();

  if (!btn.classList.contains('is-dodging')) {
    const btnRect = btn.getBoundingClientRect();
    btn.classList.add('is-dodging');
    btn.style.left = `${btnRect.left - rowRect.left}px`;
    btn.style.top = `${btnRect.top - rowRect.top}px`;
  }

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  const cx = clientX - rowRect.left;
  const cy = clientY - rowRect.top;
  const rw = rowRect.width;
  const rh = rowRect.height;
  const bw = btn.offsetWidth;
  const bh = btn.offsetHeight;

  let tries = 0;
  let nx;
  let ny;

  do {
    nx = 8 + Math.random() * (rw - bw - 16);
    ny = 4 + Math.random() * (rh - bh - 8);
    tries++;
  } while (tries < 30 && Math.abs(nx + bw / 2 - cx) < 90 && Math.abs(ny + bh / 2 - cy) < 45);

  btn.style.left = `${nx}px`;
  btn.style.top = `${ny}px`;
}

function setDots(active) {
  for (let i = 0; i < 5; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.className = 'dot' + (i < active ? ' done' : i === active ? ' active' : '');
  }
}

function animateCard() {
  const card = document.getElementById('card');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

function nextStage(from) {
  document.getElementById(`s${from}`).classList.remove('active');
  const next = from + 1;
  document.getElementById(`s${next}`).classList.add('active');
  setDots(next);
  animateCard();

  if (next === 4) {
    buildSummary();
    launchConfetti();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pickDate(element, value) {
  document.querySelectorAll('#dateGrid .option-card').forEach((card) => card.classList.remove('sel'));
  element.classList.add('sel');
  state.date = value;
  document.getElementById('btnDate').disabled = false;
  document.getElementById('exactDate').value = '';
  spawnHeart(element);
}

function pickExact(value) {
  if (!value) return;

  const date = new Date(`${value}T00:00:00`);
  state.date = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' 📆';

  document.querySelectorAll('#dateGrid .option-card').forEach((card) => card.classList.remove('sel'));
  document.getElementById('btnDate').disabled = false;
}

function pickFood(element, value) {
  document.querySelectorAll('.food-card').forEach((card) => card.classList.remove('sel'));
  element.classList.add('sel');
  state.food = value;
  document.getElementById('btnFood').disabled = false;
  spawnHeart(element);
}

function pickDress(element, value) {
  document.querySelectorAll('.dress-chip').forEach((chip) => chip.classList.remove('sel'));
  element.classList.add('sel');
  state.dress = value;
  document.getElementById('btnDress').disabled = false;
  spawnHeart(element);
}

function spawnHeart(element) {
  const rect = element.getBoundingClientRect();
  const cardRect = document.getElementById('card').getBoundingClientRect();
  const heart = document.createElement('div');

  heart.className = 'heart-float';
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = `${rect.left - cardRect.left + rect.width / 2 - 10}px`;
  heart.style.top = `${rect.top - cardRect.top}px`;

  document.getElementById('card').appendChild(heart);
  setTimeout(() => heart.remove(), 2000);
}

function buildSummary() {
  document.getElementById('sumDate').textContent = state.date || '—';
  document.getElementById('sumFood').textContent = state.food || '—';
  document.getElementById('sumDress').textContent = state.dress || '—';
}

function launchConfetti() {
  const box = document.getElementById('confetti-box');
  box.innerHTML = '';

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'cf';
      piece.textContent = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
      piece.style.left = `${Math.random() * 95}vw`;
      piece.style.top = '0';
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.fontSize = `${18 + Math.random() * 18}px`;
      box.appendChild(piece);
      setTimeout(() => piece.remove(), 4200);
    }, i * 80);
  }
}

function restart() {
  for (let i = 0; i < 5; i++) {
    document.getElementById(`s${i}`).classList.remove('active');
  }

  document.getElementById('s0').classList.add('active');
  setDots(0);
  state.date = null;
  state.food = null;
  state.dress = null;

  const noBtn = document.getElementById('noBtn');
  noBtn.classList.remove('is-dodging');
  noBtn.style.left = '';
  noBtn.style.top = '';

  document.getElementById('exactDate').value = '';
  document.getElementById('btnDate').disabled = true;
  document.getElementById('btnFood').disabled = true;
  document.getElementById('btnDress').disabled = true;

  document.querySelectorAll('.option-card, .food-card, .dress-chip').forEach((el) => {
    el.classList.remove('sel');
  });

  animateCard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindSelectableCards(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener('click', () => handler(element, element.dataset.value));
  });
}

function init() {
  initFloatingBackground();

  document.getElementById('yesBtn').addEventListener('click', () => nextStage(0));

  const noBtn = document.getElementById('noBtn');
  noBtn.addEventListener('mousemove', dodgeNo);
  noBtn.addEventListener('touchstart', dodgeNo);

  document.getElementById('btnDate').addEventListener('click', () => nextStage(1));
  document.getElementById('btnFood').addEventListener('click', () => nextStage(2));
  document.getElementById('btnDress').addEventListener('click', () => nextStage(3));
  document.getElementById('exactDate').addEventListener('change', (event) => pickExact(event.target.value));

  bindSelectableCards('#dateGrid .option-card', pickDate);
  bindSelectableCards('.food-card', pickFood);
  bindSelectableCards('.dress-chip', pickDress);

  document.querySelectorAll('[data-action="restart"]').forEach((button) => {
    button.addEventListener('click', restart);
  });
}

document.addEventListener('DOMContentLoaded', init);
