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
const analogClockContainer = document.getElementById('analogClockContainer');

// Elementos do relógio analógico
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

// Estado da aplicação
let currentMode = 'clock';
let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;
let clockInterval = null;

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
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
}

// Inicializar modo
function initMode() {
  switchMode(currentMode);
}

// Trocar modo
function switchMode(mode) {
  // Parar qualquer timer ativo
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
  
  // Resetar estado
  isRunning = false;
  totalSeconds = 0;
  
  // Atualizar abas ativas
  tabs.forEach(tab => {
    if (tab.dataset.mode === mode) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  currentMode = mode;
  
  // Mostrar/ocultar elementos conforme o modo
  if (mode === 'clock') {
    analogClockContainer.style.display = 'flex';
    display.style.display = 'none';
    timeInputs.style.display = 'none';
    controls.style.display = 'none';
    startAnalogClock();
  } else {
    analogClockContainer.style.display = 'none';
    display.style.display = 'block';
    controls.style.display = 'flex';
    
    if (mode === 'countdown') {
      timeInputs.style.display = 'flex';
    } else {
      timeInputs.style.display = 'none';
    }
    
    updateDisplay();
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
  }
}

// Funções do Relógio Analógico
function startAnalogClock() {
  updateAnalogClock();
  clockInterval = setInterval(updateAnalogClock, 1000);
}

function updateAnalogClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  
  // Cálculo dos ângulos (considerando 12h no topo = 0°)
  // Cada segundo = 6° (360/60)
  // Cada minuto = 6° (360/60) + ajuste suave dos segundos
  // Cada hora = 30° (360/12) + ajuste dos minutos
  
  const secondAngle = (seconds + milliseconds / 1000) * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;
  
  // Aplicar rotações aos ponteiros
  if (secondHand) {
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
  }
  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  }
  if (hourHand) {
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
  }
}

// Funções do Timer/Cronômetro
function updateDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function startTimer() {
  if (currentMode === 'countdown' && !isRunning) {
    // Obter valores dos inputs
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds === 0) {
      alert('Por favor, defina um tempo para a contagem regressiva!');
      return;
    }
  }
  
  isRunning = true;
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
  
  timerInterval = setInterval(() => {
    if (currentMode === 'stopwatch') {
      totalSeconds++;
      updateDisplay();
    } else if (currentMode === 'countdown') {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
      } else {
        // Timer terminou
        pauseTimer();
        playAlertSound();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  totalSeconds = 0;
  updateDisplay();
  
  // Limpar inputs do countdown
  if (currentMode === 'countdown') {
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
  }
}

function playAlertSound() {
  // Criar um alerta visual quando o timer terminar
  display.style.backgroundColor = '#d32f2f';
  setTimeout(() => {
    display.style.backgroundColor = '';
  }, 500);
}
