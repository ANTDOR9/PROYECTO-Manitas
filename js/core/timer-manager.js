/**
 * Gestión avanzada del temporizador del juego
 */

import { throttle } from '../utils/helpers.js';

export class TimerManager {
  constructor(options = {}) {
    this.defaults = {
      duration: 20, // segundos
      updateInterval: 100, // ms
      warningThreshold: 5, // segundos para advertencia
      onTick: null,
      onComplete: null,
      onWarning: null
    };
    
    this.config = { ...this.defaults, ...options };
    this.timeLeft = this.config.duration;
    this.isRunning = false;
    this.startTime = null;
    this.animationFrame = null;
    this.lastUpdate = 0;
    
    // Throttle callbacks para mejor performance
    this.throttledTick = throttle(this.handleTick.bind(this), this.config.updateInterval);
  }
  
  // Iniciar temporizador
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = performance.now();
    this.lastUpdate = this.startTime;
    this.timeLeft = this.config.duration;
    
    this.run();
  }
  
  // Loop principal con requestAnimationFrame
  run() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const elapsed = (currentTime - this.lastUpdate) / 1000;
    
    if (elapsed >= this.config.updateInterval / 1000) {
      this.timeLeft = Math.max(0, this.timeLeft - elapsed);
      this.lastUpdate = currentTime;
      
      this.handleTick();
      
      // Verificar si el tiempo se acabó
      if (this.timeLeft <= 0) {
        this.complete();
        return;
      }
      
      // Verificar advertencia
      if (Math.ceil(this.timeLeft) === this.config.warningThreshold) {
        this.handleWarning();
      }
    }
    
    // Continuar animación
    this.animationFrame = requestAnimationFrame(() => this.run());
  }
  
  // Manejar tick del temporizador
  handleTick() {
    const progress = (this.timeLeft / this.config.duration) * 100;
    const remainingSeconds = Math.ceil(this.timeLeft);
    
    if (this.config.onTick) {
      this.config.onTick({
        timeLeft: this.timeLeft,
        secondsLeft: remainingSeconds,
        progress,
        formattedTime: this.formatTime(remainingSeconds)
      });
    }
  }
  
  // Manejar advertencia
  handleWarning() {
    if (this.config.onWarning) {
      this.config.onWarning({
        secondsLeft: this.config.warningThreshold,
        timeLeft: this.timeLeft
      });
    }
  }
  
  // Completar temporizador
  complete() {
    this.stop();
    
    if (this.config.onComplete) {
      this.config.onComplete();
    }
  }
  
  // Pausar temporizador
  pause() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  // Reanudar temporizador
  resume() {
    if (!this.isRunning && this.timeLeft > 0) {
      this.start();
    }
  }
  
  // Detener temporizador completamente
  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  // Resetear temporizador
  reset(newDuration = null) {
    this.stop();
    if (newDuration !== null) {
      this.config.duration = newDuration;
    }
    this.timeLeft = this.config.duration;
    this.startTime = null;
    this.lastUpdate = 0;
  }
  
  // Formatear tiempo (segundos a MM:SS)
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Añadir tiempo extra
  addTime(seconds) {
    this.timeLeft += seconds;
    this.config.duration += seconds;
  }
  
  // Reducir tiempo
  subtractTime(seconds) {
    this.timeLeft = Math.max(0, this.timeLeft - seconds);
  }
  
  // Obtener tiempo transcurrido
  getElapsedTime() {
    if (!this.startTime) return 0;
    return (performance.now() - this.startTime) / 1000;
  }
  
  // Obtener tiempo restante
  getRemainingTime() {
    return this.timeLeft;
  }
  
  // Obtener porcentaje completado
  getProgress() {
    return ((this.config.duration - this.timeLeft) / this.config.duration) * 100;
  }
  
  // Cambiar configuración dinámicamente
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Verificar si está activo
  isActive() {
    return this.isRunning;
  }
  
  // Limpiar recursos
  destroy() {
    this.stop();
    this.config.onTick = null;
    this.config.onComplete = null;
    this.config.onWarning = null;
  }
}

// Factory para crear timers
export function createTimer(options = {}) {
  return new TimerManager(options);
}

// Timer global para el juego
export const gameTimer = new TimerManager({
  duration: 20,
  updateInterval: 100,
  warningThreshold: 5,
  onTick: (data) => {
    // Este callback se configurará desde el juego principal
    console.log('Timer tick:', data);
  },
  onComplete: () => {
    console.log('Timer complete!');
  },
  onWarning: () => {
    console.log('Warning: 5 seconds left!');
  }
});