/**
 * Punto de entrada principal del juego
 * Aquí se inicializa todo el sistema
 */

// Importar módulos
import { gameEngine } from './core/game-engine.js';
import { uiManager } from './ui/ui-manager.js';
import { audioManager } from './ui/audio-manager.js';
import { animationManager } from './ui/animation-manager.js';
import { loadGameData, saveSettings } from './utils/storage.js';

// Variables globales
let isInitialized = false;

/**
 * Inicializar la aplicación
 */
function initializeApp() {
  if (isInitialized) return;
  
  console.log('🚀 Inicializando aplicación...');
  
  try {
    // Cargar configuración guardada
    const savedSettings = loadGameData();
    
    // Configurar audio
    audioManager.setGlobalVolume(savedSettings.settings?.volume || 0.5);
    audioManager.setSoundVolume(savedSettings.settings?.soundVolume || 0.7);
    audioManager.setMusicVolume(savedSettings.settings?.musicVolume || 0.3);
    
    // Configurar motor del juego
    gameEngine.initialize({
      questionsPerGame: 15,
      timePerQuestion: 20,
      streakBonus: 3,
      pointsCorrect: 100,
      pointsTimeBonus: 10,
      pointsStreak: 50
    });
    
    // Configurar callbacks del juego
    setupGameCallbacks();
    
    // Registrar elementos UI
    registerUIElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar UI
    initializeUI();
    
    isInitialized = true;
    console.log('✅ Aplicación inicializada correctamente');
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
      uiManager.showToast('¡Bienvenido a MANITAS! 👋', 'info', 2000);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
    showErrorScreen(error);
  }
}

/**
 * Configurar callbacks del juego
 */
function setupGameCallbacks() {
  // Cuando cambia la pregunta
  gameEngine.on('onQuestionChange', (question) => {
    console.log('Nueva pregunta:', question.question);
    
    // Actualizar UI
    uiManager.setText('question', question.question);
    updateOptionsUI(question.options);
    
    // Resetear selección
    const options = document.querySelectorAll('.game-option-btn');
    options.forEach(btn => {
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
    });
    
    // Habilitar botón de enviar
    const sendBtn = uiManager.getElement('sendBtn');
    if (sendBtn) sendBtn.disabled = false;
  });
  
  // Cuando se envía respuesta
  gameEngine.on('onAnswerSubmit', (result) => {
    console.log('Respuesta enviada:', result.correct ? '✅ Correcta' : '❌ Incorrecta');
    
    // Mostrar resultado
    showAnswerFeedback(result);
    
    // Deshabilitar opciones
    const options = document.querySelectorAll('.game-option-btn');
    options.forEach(btn => {
      btn.disabled = true;
    });
    
    // Deshabilitar botón de enviar temporalmente
    const sendBtn = uiManager.getElement('sendBtn');
    if (sendBtn) sendBtn.disabled = true;
  });
  
  // Cuando hay racha
  gameEngine.on('onStreak', (streak) => {
    console.log(`🎯 Racha de ${streak} correctas!`);
    
    // Mostrar mensaje de racha
    const messages = [
      `¡INCREÍBLE! 🔥 ${streak} seguidas`,
      `¡IMPARABLE! 💪 ${streak} correctas`,
      `¡FANTÁSTICO! 🌟 ${streak} en racha`,
      `¡ERES UN MAESTRO! 🏆 ${streak} seguidas`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    uiManager.showToast(randomMessage, 'success', 2000);
    
    // Animación especial
    animationManager.createConfetti({
      particleCount: 200 + (streak * 20),
      colors: ['#00ff00', '#00bfa5', '#ffff00', '#ffffff']
    });
    
    // Imagen flotante especial
    animationManager.floatImage('assets/images/3.png', 'center', {
      width: 200,
      height: 200,
      duration: 1500
    });
  });
  
  // Cuando se pierde una vida
  gameEngine.on('onLifeLost', (lives) => {
    console.log(`💔 Vidas restantes: ${lives}`);
    
    // Actualizar display de vidas
    const livesDisplay = uiManager.getElement('livesDisplay');
    if (livesDisplay) {
      livesDisplay.textContent = '❤️'.repeat(lives);
      animationManager.shakeElement(livesDisplay);
    }
    
    // Mostrar advertencia si quedan pocas vidas
    if (lives === 1) {
      uiManager.showToast('¡Última vida! ¡Ten cuidado!', 'warning', 2000);
    }
  });
  
  // Cuando se actualiza el puntaje
  gameEngine.on('onScoreUpdate', (totalScore, pointsEarned) => {
    // Actualizar display de puntaje
    const scoreDisplay = uiManager.getElement('scoreDisplay');
    if (scoreDisplay) {
      scoreDisplay.textContent = totalScore;
      animationManager.pulseElement(scoreDisplay, 1.2, 200);
    }
    
    // Mostrar puntos ganados
    if (pointsEarned > 100) {
      const pointsPopup = document.createElement('div');
      pointsPopup.className = 'points-popup';
      pointsPopup.textContent = `+${pointsEarned}`;
      pointsPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.5rem;
        font-weight: bold;
        color: #00ff00;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        z-index: 10000;
        animation: float-up 1s ease-out forwards;
      `;
      
      document.body.appendChild(pointsPopup);
      setTimeout(() => pointsPopup.remove(), 1000);
    }
  });
  
  // Cuando termina el juego
  gameEngine.on('onGameEnd', (result) => {
    console.log('Juego terminado:', result);
    
    // Guardar estadísticas
    saveSettings({
      lastPlayed: new Date().toISOString(),
      lastScore: result.score
    });
  });
}

/**
 * Registrar elementos UI
 */
function registerUIElements() {
  // Elementos principales del juego
  uiManager.registerElement('question', document.getElementById('question'));
  uiManager.registerElement('options', document.getElementById('options'));
  uiManager.registerElement('sendBtn', document.getElementById('sendBtn'));
  uiManager.registerElement('timerDisplay', document.getElementById('timerDisplay'));
  uiManager.registerElement('progressBar', document.getElementById('progress'));
  uiManager.registerElement('scoreDisplay', document.getElementById('totalCorrectDisplay'));
  uiManager.registerElement('streakDisplay', document.getElementById('streakDisplay'));
  uiManager.registerElement('livesDisplay', document.getElementById('livesDisplay') || createLivesDisplay());
  uiManager.registerElement('questionCounter', document.getElementById('questionCounter') || createQuestionCounter());
  
  // Botones de control
  const pauseBtn = document.getElementById('pauseBtn') || createPauseButton();
  uiManager.registerElement('pauseBtn', pauseBtn);
  
  const soundToggle = document.getElementById('soundToggle') || createSoundToggle();
  uiManager.registerElement('soundToggle', soundToggle);
}

/**
 * Crear display de vidas si no existe
 */
function createLivesDisplay() {
  const display = document.createElement('div');
  display.id = 'livesDisplay';
  display.style.cssText = `
    position: absolute;
    top: 120px;
    right: 20px;
    font-size: 2rem;
    color: #ff0000;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    z-index: 2;
  `;
  display.textContent = '❤️❤️❤️';
  document.querySelector('.container').appendChild(display);
  return display;
}

/**
 * Crear contador de preguntas si no existe
 */
function createQuestionCounter() {
  const counter = document.createElement('div');
  counter.id = 'questionCounter';
  counter.style.cssText = `
    position: absolute;
    top: 120px;
    left: 20px;
    font-size: 1.5rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    z-index: 2;
  `;
  counter.textContent = '0/15';
  document.querySelector('.container').appendChild(counter);
  return counter;
}

/**
 * Crear botón de pausa si no existe
 */
function createPauseButton() {
  const btn = document.createElement('button');
  btn.id = 'pauseBtn';
  btn.innerHTML = '⏸️';
  btn.title = 'Pausar juego';
  btn.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    color: white;
    border: 2px solid white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 2;
  `;
  document.querySelector('.container').appendChild(btn);
  return btn;
}

/**
 * Crear toggle de sonido si no existe
 */
function createSoundToggle() {
  const toggle = document.createElement('button');
  toggle.id = 'soundToggle';
  toggle.innerHTML = '🔊';
  toggle.title = 'Alternar sonido';
  toggle.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    color: white;
    border: 2px solid white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 2;
  `;
  document.querySelector('.container').appendChild(toggle);
  return toggle;
}

/**
 * Actualizar UI de opciones
 */
function updateOptionsUI(options) {
  const optionsContainer = uiManager.getElement('options');
  if (!optionsContainer) return;
  
  optionsContainer.innerHTML = '';
  
  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'game-option-btn';
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.dataset.index = index;
    
    // Evento click
    button.addEventListener('click', () => {
      // Remover selección anterior
      document.querySelectorAll('.game-option-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Seleccionar esta opción
      button.classList.add('selected');
      gameEngine.selectAnswer(index);
      
      // Reproducir sonido de click
      audioManager.playClickSound();
    });
    
    optionsContainer.appendChild(button);
  });
}

/**
 * Mostrar feedback de respuesta
 */
function showAnswerFeedback(result) {
  const options = document.querySelectorAll('.game-option-btn');
  
  options.forEach((btn, index) => {
    if (index === result.correctAnswer) {
      btn.classList.add('correct');
      animationManager.highlightElement(btn, '#00ff00', 1000);
    } else if (index === result.selected && !result.correct) {
      btn.classList.add('incorrect');
      animationManager.shakeElement(btn);
    }
  });
  
  // Mostrar explicación si existe
  if (result.explanation) {
    setTimeout(() => {
      uiManager.showToast(result.explanation, 'info', 3000);
    }, 500);
  }
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
  // Botón de enviar respuesta
  const sendBtn = uiManager.getElement('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      gameEngine.submitAnswer();
    });
  }
  
  // Botón de pausa
  const pauseBtn = uiManager.getElement('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      const state = gameEngine.getState();
      
      if (state.isRunning && !state.isPaused) {
        gameEngine.pauseGame();
        pauseBtn.innerHTML = '▶️';
        pauseBtn.title = 'Reanudar juego';
        uiManager.showToast('Juego pausado', 'warning');
      } else if (state.isPaused) {
        gameEngine.resumeGame();
        pauseBtn.innerHTML = '⏸️';
        pauseBtn.title = 'Pausar juego';
        uiManager.showToast('Juego reanudado', 'info');
      }
    });
  }
  
  // Toggle de sonido
  const soundToggle = uiManager.getElement('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const isMuted = audioManager.toggleMute();
      soundToggle.innerHTML = isMuted ? '🔇' : '🔊';
      soundToggle.title = isMuted ? 'Activar sonido' : 'Silenciar';
      
      uiManager.showToast(
        isMuted ? 'Sonido desactivado' : 'Sonido activado',
        isMuted ? 'warning' : 'info'
      );
    });
  }
  
  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    // Espacio o Enter para enviar
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const state = gameEngine.getState();
      if (state.isRunning && !state.isPaused) {
        gameEngine.submitAnswer();
      }
    }
    
    // Números 1-4 para seleccionar opciones
    if (e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const index = parseInt(e.key) - 1;
      const options = document.querySelectorAll('.game-option-btn');
      if (options[index]) {
        options[index].click();
      }
    }
    
    // P para pausar
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      const pauseBtn = uiManager.getElement('pauseBtn');
      if (pauseBtn) pauseBtn.click();
    }
    
    // M para mute
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      const soundToggle = uiManager.getElement('soundToggle');
      if (soundToggle) soundToggle.click();
    }
    
    // ESC para salir (solo en game over/victoria)
    if (e.key === 'Escape') {
      const state = gameEngine.getState();
      if (!state.isRunning) {
        window.location.href = 'index.html';
      }
    }
  });
}

/**
 * Inicializar UI
 */
function initializeUI() {
  // Aplicar clases responsivas
  uiManager.handleResize();
  
  // Mostrar controles
  uiManager.showElement('sendBtn');
  uiManager.showElement('pauseBtn');
  uiManager.showElement('soundToggle');
  
  // Iniciar juego automáticamente después de 2 segundos
  setTimeout(() => {
    gameEngine.startGame();
  }, 2000);
}

/**
 * Mostrar pantalla de error
 */
function showErrorScreen(error) {
  const errorHTML = `
    <div style="text-align: center; padding: 2rem; color: white;">
      <h2 style="color: #ff0000;">⚠️ Error al cargar el juego</h2>
      <p>${error.message || 'Error desconocido'}</p>
      <div style="margin-top: 2rem;">
        <button onclick="location.reload()" style="
          background: #00bfa5;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.2rem;
          cursor: pointer;
          margin-right: 1rem;
        ">
          Reintentar
        </button>
        <button onclick="window.location.href='index.html'" style="
          background: #666;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.2rem;
          cursor: pointer;
        ">
          Volver al inicio
        </button>
      </div>
    </div>
  `;
  
  const container = document.querySelector('.container');
  if (container) {
    container.innerHTML = errorHTML;
  } else {
    document.body.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      ">
        ${errorHTML}
      </div>
    `;
  }
}

/**
 * Manejar carga de la página
 */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la página del juego
  if (window.location.pathname.includes('game.html') || 
      document.querySelector('#question')) {
    
    // Iniciar aplicación después de un breve delay
    setTimeout(initializeApp, 500);
    
    // Configurar video de fondo
    const video = document.getElementById('bgVideo');
    if (video) {
      video.volume = 0.3;
      video.play().catch(e => {
        console.log('Video autoplay blocked:', e);
        // Intentar reproducir con interacción del usuario
        document.addEventListener('click', () => {
          video.play().catch(() => {});
        }, { once: true });
      });
    }
  }
});

/**
 * Función para iniciar juego desde index.html
 */
window.iniciarJuego = function() {
  window.location.href = 'game.html';
};

/**
 * Función para habilitar sonido (usada en index.html)
 */
window.enableSound = function() {
  const video = document.getElementById('videoFondo');
  if (video) {
    video.muted = false;
    video.volume = 0.3;
  }
};

// Exportar para uso global (opcional)
window.gameEngine = gameEngine;
window.uiManager = uiManager;
window.audioManager = audioManager;