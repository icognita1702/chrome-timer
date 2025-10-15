// Elementos DOM
const modeTabs = document.querySelectorAll('.mode-tab');
const clockContainer = document.querySelector('.clock-container');

// Elementos do relógio analógico
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const timeText = document.getElementById('time-text');
const sessionText = document.getElementById('session-text');

// Botões de controle
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Estado da aplicação
let currentMode = 'clock';
let clockInterval = null;
let pomodoroState = 'ready'; // ready, work, break, longBreak
let pomodoroTime = 0;
let pomodoroRunning = false;
let workDuration = 25 * 60; // 25 minutos em segundos
let breakDuration = 5 * 60; // 5 minutos em segundos
let longBreakDuration = 15 * 60; // 15 minutos em segundos
let pomodoroCount = 0;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupTabListeners();
  setupControlListeners();
  initMode();
});

// Configurar listeners das abas
function setupTabListeners() {
  if (!modeTabs) return;
  
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      switchMode(mode);
    });
  });
}

// Configurar listeners dos controles
function setupControlListeners() {
  if (startBtn) {
    startBtn.addEventListener('click', handleStart);
  }
  
  if (pauseBtn) {
    pauseBtn.addEventListener('click', handlePause);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }
}

// Trocar modo
function switchMode(mode) {
  currentMode = mode;
  
  // Atualizar abas ativas
  modeTabs.forEach(tab => {
    if (tab.dataset.mode === mode) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });
  
  // Parar todos os timers
  stopClock();
  
  // Inicializar modo
  if (mode === 'clock') {
    startClock();
    if (sessionText) sessionText.textContent = 'Pronto';
    if (timeText) timeText.style.display = 'none';
  } else if (mode === 'countdown') {
    pomodoroState = 'ready';
    pomodoroTime = workDuration;
    updatePomodoroDisplay();
    if (timeText) timeText.style.display = 'block';
  }
}

// Inicializar modo
function initMode() {
  switchMode(currentMode);
}

// ========== RELÓGIO ANALÓGICO ==========
function startClock() {
  updateAnalogClock();
  clockInterval = setInterval(updateAnalogClock, 1000);
}

function stopClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

function updateAnalogClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Calcular ângulos (0 graus = 12h, sentido horário)
  // Subtraindo 90 graus para começar do topo (12h)
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
  
  // Ponteiro dos segundos (comprimento: 140 pixels)
  const secondX = cx + 140 * Math.cos(secondAngle * Math.PI / 180);
  const secondY = cy + 140 * Math.sin(secondAngle * Math.PI / 180);
  
  // Aplicar transformações aos ponteiros
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

// ========== CONTROLES DO POMODORO ==========
function handleStart() {
  if (currentMode === 'countdown') {
    if (!pomodoroRunning) {
      pomodoroRunning = true;
      if (pomodoroState === 'ready') {
        pomodoroState = 'work';
        pomodoroTime = workDuration;
      }
      startPomodoro();
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
    }
  }
}

function handlePause() {
  if (currentMode === 'countdown' && pomodoroRunning) {
    pomodoroRunning = false;
    stopClock();
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';
  }
}

function handleReset() {
  if (currentMode === 'countdown') {
    pomodoroRunning = false;
    pomodoroState = 'ready';
    pomodoroTime = workDuration;
    pomodoroCount = 0;
    stopClock();
    updatePomodoroDisplay();
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    if (sessionText) sessionText.textContent = 'Pronto';
  }
}

function startPomodoro() {
  stopClock();
  clockInterval = setInterval(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroTime--;
      updatePomodoroDisplay();
    } else if (pomodoroTime === 0) {
      handlePomodoroComplete();
    }
  }, 1000);
}

function handlePomodoroComplete() {
  pomodoroRunning = false;
  
  if (pomodoroState === 'work') {
    pomodoroCount++;
    if (pomodoroCount % 4 === 0) {
      pomodoroState = 'longBreak';
      pomodoroTime = longBreakDuration;
      if (sessionText) sessionText.textContent = 'Intervalo Longo';
    } else {
      pomodoroState = 'break';
      pomodoroTime = breakDuration;
      if (sessionText) sessionText.textContent = 'Intervalo';
    }
  } else {
    pomodoroState = 'work';
    pomodoroTime = workDuration;
    if (sessionText) sessionText.textContent = 'Foco';
  }
  
  updatePomodoroDisplay();
  playNotification();
  
  // Auto-start next session after 3 seconds
  setTimeout(() => {
    if (!pomodoroRunning) {
      handleStart();
    }
  }, 3000);
}

function updatePomodoroDisplay() {
  if (!timeText) return;
  
  const minutes = Math.floor(pomodoroTime / 60);
  const seconds = pomodoroTime % 60;
  
  timeText.textContent = `${pad(minutes)}:${pad(seconds)}`;
  
  // Atualizar label da sessão
  if (sessionText) {
    if (pomodoroState === 'ready') {
      sessionText.textContent = 'Pronto';
    } else if (pomodoroState === 'work') {
      sessionText.textContent = 'Foco';
    } else if (pomodoroState === 'break') {
      sessionText.textContent = 'Intervalo';
    } else if (pomodoroState === 'longBreak') {
      sessionText.textContent = 'Intervalo Longo';
    }
  }
}

function playNotification() {
  // Notificação usando a API de notificações do navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Timer Pomodoro', {
      body: pomodoroState === 'work' ? 'Tempo de intervalo!' : 'Hora de focar!',
      icon: 'icon.png'
    });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Timer Pomodoro', {
          body: pomodoroState === 'work' ? 'Tempo de intervalo!' : 'Hora de focar!',
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
