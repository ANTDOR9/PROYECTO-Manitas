/**
 * Motor principal del juego
 */

import { questionManager } from './question-manager.js';
import { gameTimer } from './timer-manager.js';
import { uiManager } from '../ui/ui-manager.js';
import { audioManager } from '../ui/audio-manager.js';
import { animationManager } from '../ui/animation-manager.js';
import { registerGame, updateHighScore, loadGameData } from '../utils/storage.js';
import { debounce, shuffleArray } from '../utils/helpers.js';

export class GameEngine {
  constructor() {
    this.state = {
      isRunning: false,
      isPaused: false,
      currentQuestion: null,
      selectedAnswer: null,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: 0,
      timeElapsed: 0,
      gameMode: 'normal', // 'normal', 'timeAttack', 'survival'
      difficulty: 'medium',
      maxLives: 3,
      lives: 3,
      maxTime: 20,
      timeBonus: 0,
      comboMultiplier: 1
    };
    
    this.config = {
      questionsPerGame: 15,
      timePerQuestion: 20,
      streakBonus: 3,
      pointsCorrect: 100,
      pointsTimeBonus: 10,
      pointsStreak: 50,
      maxStreakBonus: 5
    };
    
    this.gameStats = {
      startTime: null,
      endTime: null,
      questionsAnswered: 0,
      averageTime: 0,
      bestStreak: 0
    };
    
    this.callbacks = {
      onGameStart: null,
      onGameEnd: null,
      onQuestionChange: null,
      onAnswerSubmit: null,
      onStreak: null,
      onLifeLost: null,
      onScoreUpdate: null
    };
    
    // Bind methods
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleTimeOut = this.handleTimeOut.bind(this);
  }
  
  // Inicializar juego
  initialize(config = {}) {
    this.config = { ...this.config, ...config };
    this.resetState();
    
    // Configurar timer
    gameTimer.updateConfig({
      duration: this.config.timePerQuestion,
      onTick: this.handleTimeUpdate,
      onComplete: this.handleTimeOut,
      warningThreshold: 5
    });
    
    // Precargar sonidos
    this.preloadAudio();
    
    // Barajar preguntas
    questionManager.shuffleQuestions();
    
    return this;
  }
  
  // Precargar audio
  preloadAudio() {
    audioManager.registerSound('correct', 'assets/audio/o.mp3');
    audioManager.registerSound('wrong', 'assets/audio/q.mp3');
    audioManager.registerSound('click', 'assets/audio/click.mp3');
    audioManager.registerSound('streak', 'assets/audio/streak.mp3');
    audioManager.registerSound('timeout', 'assets/audio/timeout.mp3');
  }
  
  // Resetear estado
  resetState() {
    this.state = {
      isRunning: false,
      isPaused: false,
      currentQuestion: null,
      selectedAnswer: null,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: 0,
      timeElapsed: 0,
      gameMode: this.state.gameMode,
      difficulty: this.state.difficulty,
      maxLives: this.state.maxLives,
      lives: this.state.maxLives,
      maxTime: this.config.timePerQuestion,
      timeBonus: 0,
      comboMultiplier: 1
    };
    
    this.gameStats = {
      startTime: null,
      endTime: null,
      questionsAnswered: 0,
      averageTime: 0,
      bestStreak: 0
    };
  }
  
  // Iniciar juego
  startGame() {
    if (this.state.isRunning) return;
    
    this.resetState();
    this.state.isRunning = true;
    this.gameStats.startTime = Date.now();
    
    // Mostrar primera pregunta
    this.nextQuestion();
    
    // Llamar callback
    if (this.callbacks.onGameStart) {
      this.callbacks.onGameStart(this.state);
    }
    
    console.log('Game started');
    return this.state;
  }
  
  // Pausar juego
  pauseGame() {
    if (!this.state.isRunning || this.state.isPaused) return;
    
    this.state.isPaused = true;
    gameTimer.pause();
    audioManager.pauseAll();
    
    return this.state;
  }
  
  // Reanudar juego
  resumeGame() {
    if (!this.state.isRunning || !this.state.isPaused) return;
    
    this.state.isPaused = false;
    gameTimer.resume();
    audioManager.resumeAll();
    
    return this.state;
  }
  
  // Detener juego
  stopGame() {
    if (!this.state.isRunning) return;
    
    this.state.isRunning = false;
    this.state.isPaused = false;
    gameTimer.stop();
    this.gameStats.endTime = Date.now();
    
    // Registrar estadísticas
    this.registerGameStats();
    
    // Llamar callback
    if (this.callbacks.onGameEnd) {
      this.callbacks.onGameEnd(this.getGameResult());
    }
    
    return this.getGameResult();
  }
  
  // Siguiente pregunta
  nextQuestion() {
    if (!this.state.isRunning) return;
    
    // Resetear selección
    this.state.selectedAnswer = null;
    
    // Obtener nueva pregunta
    this.state.currentQuestion = questionManager.getNextQuestion();
    this.state.totalQuestions++;
    
    // Resetear timer
    gameTimer.reset(this.config.timePerQuestion + this.state.timeBonus);
    gameTimer.start();
    
    // Llamar callback
    if (this.callbacks.onQuestionChange) {
      this.callbacks.onQuestionChange(this.state.currentQuestion);
    }
    
    // Actualizar UI
    this.updateUI();
    
    return this.state.currentQuestion;
  }
  
  // Seleccionar respuesta
  selectAnswer(answerIndex) {
    if (!this.state.isRunning || this.state.selectedAnswer !== null) return;
    
    this.state.selectedAnswer = answerIndex;
    
    // Actualizar UI para mostrar selección
    this.updateUI();
    
    return answerIndex;
  }
  
  // Enviar respuesta
  submitAnswer() {
    if (!this.state.isRunning || this.state.selectedAnswer === null) return;
    
    // Detener timer
    gameTimer.stop();
    const timeLeft = gameTimer.getRemainingTime();
    const timeTaken = this.config.timePerQuestion - timeLeft;
    
    // Verificar respuesta
    const result = questionManager.checkAnswer(
      this.state.currentQuestion.id,
      this.state.selectedAnswer
    );
    
    // Procesar resultado
    this.processAnswer(result, timeTaken, timeLeft);
    
    // Llamar callback
    if (this.callbacks.onAnswerSubmit) {
      this.callbacks.onAnswerSubmit({
        question: this.state.currentQuestion,
        selected: this.state.selectedAnswer,
        correct: result.correct,
        explanation: result.explanation,
        timeTaken: timeTaken,
        timeLeft: timeLeft
      });
    }
    
    // Pasar a siguiente pregunta o terminar juego
    setTimeout(() => {
      if (this.state.lives <= 0) {
        this.gameOver();
      } else if (this.state.totalQuestions >= this.config.questionsPerGame) {
        this.gameCompleted();
      } else {
        this.nextQuestion();
      }
    }, 1500);
    
    return result;
  }
  
  // Procesar respuesta
  processAnswer(result, timeTaken, timeLeft) {
    this.gameStats.questionsAnswered++;
    this.gameStats.averageTime = (
      (this.gameStats.averageTime * (this.gameStats.questionsAnswered - 1) + timeTaken) / 
      this.gameStats.questionsAnswered
    );
    
    if (result.correct) {
      // Respuesta correcta
      this.handleCorrectAnswer(timeTaken, timeLeft);
    } else {
      // Respuesta incorrecta
      this.handleIncorrectAnswer();
    }
  }
  
  // Manejar respuesta correcta
  handleCorrectAnswer(timeTaken, timeLeft) {
    // Reproducir sonido
    audioManager.playCorrectSound();
    
    // Actualizar estadísticas
    this.state.correctAnswers++;
    this.state.streak++;
    
    // Actualizar mejor racha
    if (this.state.streak > this.gameStats.bestStreak) {
      this.gameStats.bestStreak = this.state.streak;
    }
    
    // Calcular puntos
    let points = this.config.pointsCorrect;
    
    // Bonus por tiempo
    const timeBonus = Math.floor(timeLeft * this.config.pointsTimeBonus);
    points += timeBonus;
    this.state.timeBonus = Math.min(5, (this.state.timeBonus || 0) + 1);
    
    // Bonus por racha
    if (this.state.streak >= this.config.streakBonus) {
      const streakBonus = Math.min(
        this.state.streak * this.config.pointsStreak,
        this.config.maxStreakBonus * this.config.pointsStreak
      );
      points += streakBonus;
      
      // Llamar callback de racha
      if (this.state.streak % this.config.streakBonus === 0) {
        if (this.callbacks.onStreak) {
          this.callbacks.onStreak(this.state.streak);
        }
        
        // Reproducir sonido de racha
        audioManager.playStreakSound();
        
        // Mostrar animación de racha
        animationManager.createConfetti({
          particleCount: 100 + (this.state.streak * 10),
          colors: ['#00ff00', '#00bfa5', '#ffff00', '#ffffff']
        });
      }
    }
    
    // Aplicar multiplicador de combo
    points *= this.state.comboMultiplier;
    
    // Actualizar puntaje
    this.state.score += points;
    
    // Llamar callback de actualización de puntaje
    if (this.callbacks.onScoreUpdate) {
      this.callbacks.onScoreUpdate(this.state.score, points);
    }
    
    // Mostrar feedback
    uiManager.showAnswerFeedback(true, `+${points} puntos!`);
    
    // Mostrar imagen flotante
    animationManager.floatImage('assets/images/9.png', 'right');
  }
  
  // Manejar respuesta incorrecta
  handleIncorrectAnswer() {
    // Reproducir sonido
    audioManager.playWrongSound();
    
    // Actualizar estadísticas
    this.state.incorrectAnswers++;
    this.state.streak = 0;
    this.state.comboMultiplier = 1;
    this.state.timeBonus = 0;
    this.state.lives--;
    
    // Llamar callback de vida perdida
    if (this.callbacks.onLifeLost) {
      this.callbacks.onLifeLost(this.state.lives);
    }
    
    // Mostrar feedback
    uiManager.showAnswerFeedback(false, `Vidas: ${this.state.lives}`);
    
    // Mostrar imagen flotante
    animationManager.floatImage('assets/images/8.png', 'left');
    
    // Animación de shake
    const questionElement = uiManager.getElement('question');
    if (questionElement) {
      animationManager.shakeElement(questionElement);
    }
  }
  
  // Manejar tiempo agotado
  handleTimeOut() {
    if (!this.state.isRunning || this.state.selectedAnswer !== null) return;
    
    // Reproducir sonido de tiempo agotado
    audioManager.playSound('timeout');
    
    // Contar como incorrecta
    this.state.incorrectAnswers++;
    this.state.streak = 0;
    this.state.comboMultiplier = 1;
    this.state.timeBonus = 0;
    this.state.lives--;
    
    // Llamar callback de vida perdida
    if (this.callbacks.onLifeLost) {
      this.callbacks.onLifeLost(this.state.lives);
    }
    
    // Mostrar mensaje
    uiManager.showToast('¡Tiempo agotado!', 'warning');
    
    // Pasar a siguiente pregunta o terminar
    setTimeout(() => {
      if (this.state.lives <= 0) {
        this.gameOver();
      } else {
        this.nextQuestion();
      }
    }, 1500);
  }
  
  // Manejar actualización de tiempo
  handleTimeUpdate(data) {
    // Actualizar UI del timer
    if (uiManager.getElement('timerDisplay')) {
      uiManager.setText('timerDisplay', `${data.secondsLeft}s`);
    }
    
    if (uiManager.getElement('progressBar')) {
      animationManager.animateProgressBar(
        uiManager.getElement('progressBar'),
        null,
        data.progress
      );
    }
    
    // Cambiar color cuando queda poco tiempo
    if (data.secondsLeft <= 5) {
      const timerElement = uiManager.getElement('timerDisplay');
      const progressElement = uiManager.getElement('progressBar');
      
      if (timerElement) {
        timerElement.style.color = '#ff0000';
        timerElement.style.animation = 'pulse 0.5s infinite';
      }
      
      if (progressElement) {
        progressElement.style.background = 'linear-gradient(90deg, #ff0000, #ff8800)';
      }
    }
  }
  
  // Juego completado
  gameCompleted() {
    this.state.isRunning = false;
    gameTimer.stop();
    this.gameStats.endTime = Date.now();
    
    // Bonus por vidas restantes
    const livesBonus = this.state.lives * 500;
    this.state.score += livesBonus;
    
    // Bonus por tiempo total
    const totalTime = (this.gameStats.endTime - this.gameStats.startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(1000 - totalTime));
    this.state.score += timeBonus;
    
    // Verificar si es nuevo récord
    const isNewHighScore = updateHighScore(this.state.score);
    
    // Registrar estadísticas
    this.registerGameStats();
    
    // Mostrar pantalla de victoria
    this.showVictoryScreen(isNewHighScore);
    
    // Llamar callback
    if (this.callbacks.onGameEnd) {
      this.callbacks.onGameEnd(this.getGameResult());
    }
    
    console.log('Game completed!');
  }
  
  // Game over
  gameOver() {
    this.state.isRunning = false;
    gameTimer.stop();
    this.gameStats.endTime = Date.now();
    
    // Registrar estadísticas
    this.registerGameStats();
    
    // Mostrar pantalla de game over
    this.showGameOverScreen();
    
    // Llamar callback
    if (this.callbacks.onGameEnd) {
      this.callbacks.onGameEnd(this.getGameResult());
    }
    
    console.log('Game over!');
  }
  
  // Registrar estadísticas del juego
  registerGameStats() {
    registerGame(
      this.state.correctAnswers,
      this.state.totalQuestions,
      (this.gameStats.endTime - this.gameStats.startTime) / 1000
    );
  }
  
  // Mostrar pantalla de victoria
  showVictoryScreen(isNewHighScore = false) {
    const totalTime = (this.gameStats.endTime - this.gameStats.startTime) / 1000;
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    
    const content = `
      <div class="victory-content">
        <h2>🎉 ¡FELICIDADES! 🎉</h2>
        <p>Has completado el juego</p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Puntaje Final</span>
            <span class="stat-value">${this.state.score}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Respuestas Correctas</span>
            <span class="stat-value">${this.state.correctAnswers}/${this.state.totalQuestions}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tiempo Total</span>
            <span class="stat-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Mejor Racha</span>
            <span class="stat-value">${this.gameStats.bestStreak}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Vidas Restantes</span>
            <span class="stat-value">${this.state.lives}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Precisión</span>
            <span class="stat-value">${Math.round((this.state.correctAnswers / this.state.totalQuestions) * 100)}%</span>
          </div>
        </div>
        
        ${isNewHighScore ? '<p class="new-high-score">🎯 ¡NUEVO RÉCORD! 🎯</p>' : ''}
        
        <div class="victory-actions">
          <button id="playAgainBtn" class="btn-primary">Jugar de Nuevo</button>
          <button id="mainMenuBtn" class="btn-secondary">Menú Principal</button>
        </div>
      </div>
    `;
    
    const modal = uiManager.showModal('¡Victoria!', content, {
      closeText: 'Cerrar'
    });
    
    // Configurar botones
    modal.modal.querySelector('#playAgainBtn').addEventListener('click', () => {
      modal.close();
      setTimeout(() => this.startGame(), 500);
    });
    
    modal.modal.querySelector('#mainMenuBtn').addEventListener('click', () => {
      modal.close();
      window.location.href = 'index.html';
    });
    
    // Confetti celebration
    animationManager.createConfetti({
      particleCount: 300,
      spread: 100,
      startVelocity: 30,
      colors: ['#00ff00', '#00bfa5', '#ffff00', '#ffffff', '#ff00ff']
    });
  }
  
  // Mostrar pantalla de game over
  showGameOverScreen() {
    const content = `
      <div class="gameover-content">
        <h2>💀 GAME OVER 💀</h2>
        <p>Se te han acabado las vidas</p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Puntaje Final</span>
            <span class="stat-value">${this.state.score}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Respuestas Correctas</span>
            <span class="stat-value">${this.state.correctAnswers}/${this.state.totalQuestions}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Mejor Racha</span>
            <span class="stat-value">${this.gameStats.bestStreak}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Precisión</span>
            <span class="stat-value">${Math.round((this.state.correctAnswers / this.state.totalQuestions) * 100)}%</span>
          </div>
        </div>
        
        <div class="gameover-actions">
          <button id="retryBtn" class="btn-primary">Reintentar</button>
          <button id="mainMenuBtn" class="btn-secondary">Menú Principal</button>
        </div>
      </div>
    `;
    
    const modal = uiManager.showModal('Game Over', content, {
      closeText: 'Cerrar'
    });
    
    // Configurar botones
    modal.modal.querySelector('#retryBtn').addEventListener('click', () => {
      modal.close();
      setTimeout(() => this.startGame(), 500);
    });
    
    modal.modal.querySelector('#mainMenuBtn').addEventListener('click', () => {
      modal.close();
      window.location.href = 'index.html';
    });
  }
  
  // Obtener resultado del juego
  getGameResult() {
    const totalTime = this.gameStats.endTime ? 
      (this.gameStats.endTime - this.gameStats.startTime) / 1000 : 0;
    
    return {
      score: this.state.score,
      correctAnswers: this.state.correctAnswers,
      totalQuestions: this.state.totalQuestions,
      accuracy: this.state.totalQuestions > 0 ? 
        (this.state.correctAnswers / this.state.totalQuestions) * 100 : 0,
      streak: this.gameStats.bestStreak,
      livesLeft: this.state.lives,
      totalTime: totalTime,
      averageTime: this.gameStats.averageTime,
      isCompleted: this.state.totalQuestions >= this.config.questionsPerGame,
      isGameOver: this.state.lives <= 0
    };
  }
  
  // Actualizar UI
  updateUI() {
    // Actualizar pregunta
    if (uiManager.getElement('question') && this.state.currentQuestion) {
      uiManager.setText('question', this.state.currentQuestion.question);
    }
    
    // Actualizar opciones
    if (uiManager.getElement('options') && this.state.currentQuestion) {
      this.updateOptionsUI();
    }
    
    // Actualizar puntaje
    if (uiManager.getElement('scoreDisplay')) {
      uiManager.setText('scoreDisplay', this.state.score.toString());
    }
    
    // Actualizar racha
    if (uiManager.getElement('streakDisplay')) {
      uiManager.setText('streakDisplay', this.state.streak.toString());
      
      // Resaltar si hay racha
      if (this.state.streak >= this.config.streakBonus) {
        uiManager.setClass('streakDisplay', 'streak-active', true);
      } else {
        uiManager.setClass('streakDisplay', 'streak-active', false);
      }
    }
    
    // Actualizar vidas
    if (uiManager.getElement('livesDisplay')) {
      uiManager.setText('livesDisplay', '❤️'.repeat(this.state.lives));
    }
    
    // Actualizar número de pregunta
    if (uiManager.getElement('questionCounter')) {
      uiManager.setText(
        'questionCounter',
        `${this.state.totalQuestions}/${this.config.questionsPerGame}`
      );
    }
  }
  
  // Actualizar UI de opciones
  updateOptionsUI() {
    const optionsContainer = uiManager.getElement('options');
    if (!optionsContainer || !this.state.currentQuestion) return;
    
    // Limpiar opciones anteriores
    optionsContainer.innerHTML = '';
    
    // Crear nuevas opciones
    this.state.currentQuestion.options.forEach((option, index) => {
      const optionButton = uiManager.createElement('button', {
        className: `game-option-btn ${this.state.selectedAnswer === index ? 'selected' : ''}`,
        text: `${String.fromCharCode(65 + index)}. ${option}`,
        attributes: {
          'data-index': index.toString()
        },
        onClick: () => this.selectAnswer(index)
      });
      
      optionsContainer.appendChild(optionButton);
    });
  }
  
  // Configurar callbacks
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
    return this;
  }
  
  // Obtener estado actual
  getState() {
    return { ...this.state };
  }
  
  // Obtener configuración
  getConfig() {
    return { ...this.config };
  }
  
  // Obtener estadísticas
  getStats() {
    return { ...this.gameStats };
  }
  
  // Actualizar configuración
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    return this;
  }
  
  // Actualizar modo de juego
  setGameMode(mode) {
    this.state.gameMode = mode;
    
    switch(mode) {
      case 'timeAttack':
        this.config.timePerQuestion = 15;
        this.config.questionsPerGame = 20;
        this.state.maxLives = 1;
        this.state.lives = 1;
        break;
      case 'survival':
        this.config.timePerQuestion = 25;
        this.config.questionsPerGame = Infinity;
        this.state.maxLives = 1;
        this.state.lives = 1;
        break;
      case 'normal':
      default:
        this.config.timePerQuestion = 20;
        this.config.questionsPerGame = 15;
        this.state.maxLives = 3;
        this.state.lives = 3;
        break;
    }
    
    return this;
  }
  
  // Actualizar dificultad
  setDifficulty(difficulty) {
    this.state.difficulty = difficulty;
    
    switch(difficulty) {
      case 'hard':
        this.config.timePerQuestion = 15;
        this.config.pointsCorrect = 150;
        break;
      case 'easy':
        this.config.timePerQuestion = 30;
        this.config.pointsCorrect = 50;
        break;
      case 'medium':
      default:
        this.config.timePerQuestion = 20;
        this.config.pointsCorrect = 100;
        break;
    }
    
    return this;
  }
}

// Instancia global del juego
export const gameEngine = new GameEngine();