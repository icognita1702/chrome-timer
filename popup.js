// Elementos DOM
const display = document.getElementById('display');
const tabs = document.querySelectorAll('.tab');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timeInputs = document.getElementById('timeInputs');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const controls = document.getElementById('controls');

// Estado da aplicação
let currentMode = 'clock';
let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupTabListeners();
  setupButtonListeners();
  initMode();
});

// Configurar listeners das abas
function setupTabListeners() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      switchMode(mode);
    });
  });
}

// Configurar listeners dos botões
function setupButtonListeners() {
  startBtn.addEventListener('click', handleStart);
  pauseBtn.addEventListener('click', handlePause);
  resetBtn.addEventListener('click', handleReset);
}

// Trocar modo
function switchMode(mode) {
  // Parar qualquer timer ativo
  stopTimer();
  
  // Atualizar abas ativas
  tabs.forEach(tab => {
    if (tab.dataset.mode === mode) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  currentMode = mode;
  totalSeconds = 0;
  isRunning = false;
  
  initMode();
}

// Inicializar modo atual
function initMode() {
  stopTimer();
  display.classList.remove('running');
  
  switch (currentMode) {
    case 'clock':
      initClock();
      break;
    case 'stopwatch':
      initStopwatch();
      break;
    case 'countdown':
      initCountdown();
      break;
  }
}

// ===== RELÓGIO =====
function initClock() {
  timeInputs.style.display = 'none';
  controls.style.display = 'none';
  updateClock();
  timerInterval = setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  display.textContent = `${hours}:${minutes}:${seconds}`;
}

// ===== CRONÔMETRO =====
function initStopwatch() {
  timeInputs.style.display = 'none';
  controls.style.display = 'flex';
  totalSeconds = 0;
  updateDisplay();
  resetButtons();
}

function startStopwatch() {
  if (!isRunning) {
    isRunning = true;
    display.classList.add('running');
    timerInterval = setInterval(() => {
      totalSeconds++;
      updateDisplay();
    }, 1000);
    toggleButtons(true);
  }
}

// ===== TEMPORIZADOR (COUNTDOWN) =====
function initCountdown() {
  timeInputs.style.display = 'flex';
  controls.style.display = 'flex';
  totalSeconds = 0;
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  updateDisplay();
  resetButtons();
}

function startCountdown() {
  if (!isRunning) {
    // Obter valores dos inputs
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds === 0) {
      alert('Por favor, defina um tempo!');
      return;
    }
    
    isRunning = true;
    display.classList.add('running');
    timeInputs.style.display = 'none';
    
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateDisplay();
      
      if (totalSeconds <= 0) {
        stopTimer();
        display.textContent = '00:00:00';
        alert('Tempo esgotado!');
        handleReset();
      }
    }, 1000);
    
    toggleButtons(true);
  }
}

// ===== FUNÇÕES AUXILIARES =====
function updateDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isRunning = false;
  display.classList.remove('running');
}

function resetButtons() {
  startBtn.style.display = 'block';
  pauseBtn.style.display = 'none';
  startBtn.disabled = false;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
}

function toggleButtons(running) {
  if (running) {
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
  } else {
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  }
}

// ===== HANDLERS DOS BOTÕES =====
function handleStart() {
  switch (currentMode) {
    case 'stopwatch':
      startStopwatch();
      break;
    case 'countdown':
      startCountdown();
      break;
  }
}

function handlePause() {
  stopTimer();
  toggleButtons(false);
}

function handleReset() {
  stopTimer();
  totalSeconds = 0;
  
  switch (currentMode) {
    case 'stopwatch':
      initStopwatch();
      break;
    case 'countdown':
      initCountdown();
      break;
  }
}
