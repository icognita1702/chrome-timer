// Elementos DOM
const tabs = document.querySelectorAll('.tab');
const analogClockContainer = document.getElementById('analogClockContainer');
const stopwatchContainer = document.getElementById('stopwatchContainer');
const countdownContainer = document.getElementById('countdownContainer');

// Elementos do cronômetro
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startStopwatch = document.getElementById('startStopwatch');
const resetStopwatch = document.getElementById('resetStopwatch');

// Elementos do timer
const countdownDisplay = document.getElementById('countdownDisplay');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const startCountdown = document.getElementById('startCountdown');
const pauseCountdown = document.getElementById('pauseCountdown');
const resetCountdown = document.getElementById('resetCountdown');

// Elementos do relógio analógico
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

// Estado da aplicação
let currentMode = 'clock';
let clockInterval = null;
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let countdownInterval = null;
let countdownTime = 0;
let countdownRunning = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupTabListeners();
  setupStopwatchListeners();
  setupCountdownListeners();
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

// Configurar listeners do cronômetro
function setupStopwatchListeners() {
  startStopwatch.addEventListener('click', () => {
    if (stopwatchRunning) {
      stopStopwatch();
    } else {
      startStopwatchTimer();
    }
  });
  
  resetStopwatch.addEventListener('click', () => {
    resetStopwatchTimer();
  });
}

// Configurar listeners do timer
function setupCountdownListeners() {
  startCountdown.addEventListener('click', () => {
    if (!countdownRunning) {
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      countdownTime = hours * 3600 + minutes * 60 + seconds;
      if (countdownTime > 0) {
        startCountdownTimer();
      }
    }
  });
  
  pauseCountdown.addEventListener('click', () => {
    if (countdownRunning) {
      pauseCountdownTimer();
    }
  });
  
  resetCountdown.addEventListener('click', () => {
    resetCountdownTimer();
  });
}

// Trocar modo
function switchMode(mode) {
  currentMode = mode;
  
  // Atualizar abas ativas
  tabs.forEach(tab => {
    if (tab.dataset.mode === mode) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Parar todos os timers
  stopClock();
  stopStopwatch();
  pauseCountdownTimer();
  
  // Mostrar conteúdo correto
  analogClockContainer.style.display = mode === 'clock' ? 'flex' : 'none';
  stopwatchContainer.style.display = mode === 'stopwatch' ? 'block' : 'none';
  countdownContainer.style.display = mode === 'countdown' ? 'block' : 'none';
  
  // Inicializar modo
  if (mode === 'clock') {
    startClock();
  }
}

// Inicializar modo
function initMode() {
  switchMode(currentMode);
}

// ========== RELÓGIO ANALÓGICO ==========

function startClock() {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function stopClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Calcular ângulos (0 graus = 12h, sentido horário)
  const secondAngle = (seconds * 6) - 90; // 6 graus por segundo
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 graus por minuto + movimento suave
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5) - 90; // 30 graus por hora + movimento suave
  
  // Calcular posições dos ponteiros
  const cx = 200; // centro x
  const cy = 200; // centro y
  
  // Ponteiro das horas (comprimento: 80 pixels)
  const hourX = cx + 80 * Math.cos(hourAngle * Math.PI / 180);
  const hourY = cy + 80 * Math.sin(hourAngle * Math.PI / 180);
  
  // Ponteiro dos minutos (comprimento: 120 pixels)
  const minuteX = cx + 120 * Math.cos(minuteAngle * Math.PI / 180);
  const minuteY = cy + 120 * Math.sin(minuteAngle * Math.PI / 180);
  
  // Ponteiro dos segundos (comprimento: 130 pixels)
  const secondX = cx + 130 * Math.cos(secondAngle * Math.PI / 180);
  const secondY = cy + 130 * Math.sin(secondAngle * Math.PI / 180);
  
  // Aplicar transformações
  if (hourHand) {
    hourHand.setAttribute('x2', hourX);
    hourHand.setAttribute('y2', hourY);
  }
  
  if (minuteHand) {
    minuteHand.setAttribute('x2', minuteX);
    minuteHand.setAttribute('y2', minuteY);
  }
  
  if (secondHand) {
    secondHand.setAttribute('x2', secondX);
    secondHand.setAttribute('y2', secondY);
  }
}

// ========== CRONÔMETRO ==========

function startStopwatchTimer() {
  stopwatchRunning = true;
  startStopwatch.textContent = 'Pausar';
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    updateStopwatchDisplay();
  }, 10);
}

function stopStopwatch() {
  stopwatchRunning = false;
  startStopwatch.textContent = 'Iniciar';
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
  }
}

function resetStopwatchTimer() {
  stopStopwatch();
  stopwatchTime = 0;
  updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
  const centiseconds = stopwatchTime % 100;
  const totalSeconds = Math.floor(stopwatchTime / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  
  stopwatchDisplay.textContent = 
    `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

// ========== TIMER DE CONTAGEM REGRESSIVA ==========

function startCountdownTimer() {
  countdownRunning = true;
  startCountdown.disabled = true;
  pauseCountdown.disabled = false;
  countdownInterval = setInterval(() => {
    if (countdownTime > 0) {
      countdownTime--;
      updateCountdownDisplay();
    } else {
      // Timer finalizado
      resetCountdownTimer();
      playAlarm();
    }
  }, 1000);
}

function pauseCountdownTimer() {
  countdownRunning = false;
  startCountdown.disabled = false;
  pauseCountdown.disabled = true;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function resetCountdownTimer() {
  pauseCountdownTimer();
  countdownTime = 0;
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  updateCountdownDisplay();
}

function updateCountdownDisplay() {
  const hours = Math.floor(countdownTime / 3600);
  const minutes = Math.floor((countdownTime % 3600) / 60);
  const seconds = countdownTime % 60;
  
  countdownDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function playAlarm() {
  // Notificação sonora simples usando a API de notificações do navegador
  if (Notification.permission === 'granted') {
    new Notification('Timer Finalizado!', {
      body: 'O tempo acabou!',
      icon: 'icon.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Timer Finalizado!', {
          body: 'O tempo acabou!',
          icon: 'icon.png'
        });
      }
    });
  }
}

// ========== FUNÇÕES AUXILIARES ==========

function pad(num) {
  return num.toString().padStart(2, '0');
}
