const state = { date: null, food: null, dress: null };
let notificationSent = false;

const BG_EMOJIS = ['🌸', '💕', '✨', '🌷', '💗', '🦋', '🌹', '💖', '🎀', '💝', '🌺', '💫', '🧸', '💌', '🍓'];
const CONFETTI_EMOJIS = ['🎉', '💕', '🌸', '✨', '🎊', '💗', '🌷', '🦋', '🎀', '💝', '🌺', '💫', '⭐', '🌟', '💌'];
const HEART_EMOJIS = ['💕', '💗', '💖', '✨', '💝', '🌸'];
const BURST_EMOJIS = ['💕', '✨', '🌸', '💖', '🎀', '⭐', '💗', '🦋'];
const SPARKLE_CHARS = ['✨', '⭐', '💫', '·'];

function initFloatingBackground() {
  const container = document.getElementById('floatBg');
  for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    const isHeart = i % 4 === 0;
    span.textContent = isHeart ? '💕' : BG_EMOJIS[Math.floor(Math.random() * BG_EMOJIS.length)];
    if (isHeart) span.classList.add('is-heart');
    span.style.left = `${Math.random() * 98}vw`;
    span.style.animationDuration = `${8 + Math.random() * 14}s`;
    span.style.animationDelay = `${Math.random() * -20}s`;
    span.style.fontSize = `${18 + Math.random() * 22}px`;
    container.appendChild(span);
  }
}

function initSparkles() {
  const container = document.getElementById('sparkleBg');
  for (let i = 0; i < 35; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDuration = `${2 + Math.random() * 3}s`;
    sparkle.style.animationDelay = `${Math.random() * -5}s`;
    const size = 3 + Math.random() * 4;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    container.appendChild(sparkle);
  }
}

function spawnEdgeHeart() {
  const container = document.getElementById('edgeHearts');
  const heart = document.createElement('div');
  heart.className = 'edge-heart';
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = `${5 + Math.random() * 90}vw`;
  heart.style.bottom = `${Math.random() * 15}vh`;
  heart.style.animationDuration = `${4 + Math.random() * 4}s`;
  heart.style.fontSize = `${16 + Math.random() * 14}px`;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}

function startEdgeHearts() {
  spawnEdgeHeart();
  setInterval(spawnEdgeHeart, 2200);
}

function burstAt(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'burst-particle';
    particle.textContent = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 40 + Math.random() * 60;
    particle.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
    particle.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

function clickSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'click-sparkle';
  sparkle.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
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
  const nextEl = document.getElementById(`s${next}`);
  nextEl.classList.remove('active');
  nextEl.offsetHeight;
  nextEl.classList.add('active');
  setDots(next);
  animateCard();

  if (next === 4) {
    buildSummary();
    launchConfetti();
    setTimeout(() => launchConfetti(), 600);
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
  sendNotification();
}

async function sendNotification() {
  if (notificationSent) return;
  notificationSent = true;

  const completedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Email runs in the browser — FormSubmit blocks server-side requests from Vercel.
  fetch('https://formsubmit.co/ajax/ashwinprabhu908@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: 'Someone said YES to your date! 💕',
      _template: 'table',
      _captcha: 'false',
      When: state.date || '—',
      Food: state.food || '—',
      Outfit: state.dress || '—',
      Completed: completedAt,
    }),
  }).catch(() => {});

  // SMS via Vercel API (needs FAST2SMS_API_KEY or Twilio in project settings).
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: state.date,
      food: state.food,
      dress: state.dress,
    }),
  }).catch(() => {});
}

function launchConfetti() {
  const box = document.getElementById('confetti-box');
  const count = 45;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'cf';
      piece.textContent = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
      piece.style.left = `${Math.random() * 95}vw`;
      piece.style.top = '0';
      piece.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      piece.style.fontSize = `${18 + Math.random() * 22}px`;
      box.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }, i * 60);
  }
}

function celebrateYes() {
  const btn = document.getElementById('yesBtn');
  btn.classList.add('is-celebrating');
  setTimeout(() => btn.classList.remove('is-celebrating'), 500);

  const rect = btn.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
  launchConfetti();
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
  notificationSent = false;

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
  document.getElementById('confetti-box').innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindSelectableCards(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener('click', () => handler(element, element.dataset.value));
  });
}

function init() {
  initFloatingBackground();
  initSparkles();
  startEdgeHearts();

  document.getElementById('yesBtn').addEventListener('click', () => {
    celebrateYes();
    setTimeout(() => nextStage(0), 400);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.option-card, .food-card, .dress-chip, .btn-yes, .next-btn')) {
      clickSparkle(event.clientX, event.clientY);
    }
  });

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
