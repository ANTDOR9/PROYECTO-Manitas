/**
 * Utilitarios generales para el juego
 */

// Debounce para optimizar eventos
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle para limitar frecuencia de ejecución
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Shuffle array (Fisher-Yates)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Formatear tiempo (segundos a MM:SS)
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Generar ID único
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Clamp número entre min y max
export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

// Detectar si es dispositivo móvil
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detectar si es pantalla táctil
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Prevenir comportamiento por defecto
export function preventDefault(e) {
  e.preventDefault();
}

// Copiar al portapapeles
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text).catch(err => {
    console.error('Error al copiar:', err);
  });
}

// Sleep/delay
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Validar email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Capitalizar primera letra
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Formatear número con separadores
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Medir performance de una función
export function measurePerformance(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`⏱️ ${fn.name || 'Function'} took ${(end - start).toFixed(2)}ms`);
  return result;
}

// Verificar conexión a internet
export function isOnline() {
  return navigator.onLine;
}

// Detectar preferencia de movimiento reducido
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Obtener parámetros de URL
export function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

// Scroll suave a elemento
export function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Vibrar dispositivo (si está soportado)
export function vibrate(pattern) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}