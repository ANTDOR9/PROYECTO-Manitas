/**
 * Gestión de animaciones y efectos visuales
 */

import { throttle, debounce } from '../utils/helpers.js';

export class AnimationManager {
  constructor() {
    this.activeAnimations = new Map();
    this.animationId = 0;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.performanceMode = false;
    
    // Configurar observador de reducción de movimiento
    this.setupReducedMotionObserver();
  }
  
  // Configurar observador para preferencia de movimiento reducido
  setupReducedMotionObserver() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
    });
  }
  
  // Activar/desactivar modo rendimiento
  setPerformanceMode(enabled) {
    this.performanceMode = enabled;
  }
  
  // Animación de flotar (para imágenes de feedback)
  floatImage(imageSrc, position = 'right', options = {}) {
    if (this.isReducedMotion && options.skipOnReducedMotion !== false) {
      return null;
    }
    
    const id = `float-${this.animationId++}`;
    const img = new Image();
    
    const config = {
      width: options.width || 150,
      height: options.height || 150,
      duration: options.duration || 1000,
      distance: options.distance || 100,
      startScale: options.startScale || 1,
      endScale: options.endScale || 1.2,
      ...options
    };
    
    img.src = imageSrc;
    img.id = id;
    img.style.cssText = `
      position: fixed;
      width: ${config.width}px;
      height: ${config.height}px;
      object-fit: contain;
      z-index: 9999;
      pointer-events: none;
      ${position === 'right' ? 'right: 20px;' : 'left: 20px;'}
      top: 50%;
      transform: translateY(-50%) scale(${config.startScale});
      opacity: 1;
      will-change: transform, opacity;
    `;
    
    document.body.appendChild(img);
    
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / config.duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const translateY = -50 - (config.distance * easeOutCubic);
      const scale = config.startScale + ((config.endScale - config.startScale) * easeOutCubic);
      const opacity = 1 - easeOutCubic;
      
      img.style.transform = `translateY(${translateY}%) scale(${scale})`;
      img.style.opacity = opacity;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.cleanupAnimation(id, img);
      }
    };
    
    requestAnimationFrame(animate);
    this.activeAnimations.set(id, { element: img, cancel: () => this.cleanupAnimation(id, img) });
    
    return id;
  }
  
  // Limpiar animación
  cleanupAnimation(id, element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    this.activeAnimations.delete(id);
  }
  
  // Efecto de confetti
  createConfetti(options = {}) {
    if (this.isReducedMotion) return;
    
    const config = {
      particleCount: options.particleCount || 150,
      spread: options.spread || 70,
      startVelocity: options.startVelocity || 30,
      decay: options.decay || 0.9,
      gravity: options.gravity || 0.1,
      drift: options.drift || 0,
      colors: options.colors || ['#00ff00', '#00bfa5', '#ff0000', '#ffcc00', '#ffffff'],
      shapes: options.shapes || ['circle', 'square'],
      scalar: options.scalar || 1,
      disableForReducedMotion: true,
      ...options
    };
    
    // Usar canvas-confetti si está disponible
    if (window.confetti) {
      window.confetti({
        particleCount: config.particleCount,
        angle: 90,
        spread: config.spread,
        startVelocity: config.startVelocity,
        decay: config.decay,
        gravity: config.gravity,
        drift: config.drift,
        colors: config.colors,
        shapes: config.shapes,
        scalar: config.scalar,
        disableForReducedMotion: config.disableForReducedMotion,
        origin: { x: 0.5, y: 0.8 }
      });
    } else {
      // Fallback básico si no hay confetti
      this.createBasicConfetti(config);
    }
  }
  
  // Confetti básico (fallback)
  createBasicConfetti(config) {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    `;
    
    document.body.appendChild(container);
    
    for (let i = 0; i < config.particleCount; i++) {
      this.createConfettiParticle(container, config);
    }
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 3000);
  }
  
  // Crear partícula individual de confetti
  createConfettiParticle(container, config) {
    const particle = document.createElement('div');
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
    const size = (Math.random() * 10 + 5) * config.scalar;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '0'};
      top: -20px;
      left: ${Math.random() * 100}%;
      transform: rotate(${Math.random() * 360}deg);
      opacity: 0.9;
      will-change: transform, opacity;
    `;
    
    container.appendChild(particle);
    
    // Animación
    const startX = Math.random() * window.innerWidth;
    const velocityX = (Math.random() - 0.5) * config.spread;
    const velocityY = -(Math.random() * config.startVelocity + 10);
    const rotation = (Math.random() - 0.5) * 20;
    
    let x = startX;
    let y = -20;
    let vx = velocityX;
    let vy = velocityY;
    let rot = 0;
    
    const animateParticle = () => {
      vy += config.gravity;
      vx *= config.decay;
      vy *= config.decay;
      vx += config.drift;
      
      x += vx;
      y += vy;
      rot += rotation;
      
      particle.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      particle.style.opacity = Math.max(0, 1 - (y / window.innerHeight));
      
      if (y < window.innerHeight && Math.abs(vx) > 0.1 && Math.abs(vy) > 0.1) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };
    
    requestAnimationFrame(animateParticle);
  }
  
  // Efecto de shake para errores
  shakeElement(element, intensity = 5) {
    if (this.isReducedMotion) return;
    
    const originalTransform = element.style.transform;
    const startTime = performance.now();
    const duration = 500;
    
    const shake = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Fórmula de shake
        const shakeAmount = intensity * (1 - progress);
        const x = Math.sin(elapsed * 0.1) * shakeAmount;
        const y = Math.cos(elapsed * 0.07) * shakeAmount * 0.5;
        
        element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
        requestAnimationFrame(shake);
      } else {
        element.style.transform = originalTransform;
      }
    };
    
    requestAnimationFrame(shake);
  }
  
  // Efecto de pulse para elementos
  pulseElement(element, scale = 1.1, duration = 300) {
    if (this.isReducedMotion) return;
    
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.transform = `${originalTransform} scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = originalTransform;
      
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration);
    }, duration);
  }
  
  // Efecto de fade in
  fadeIn(element, duration = 500) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      return;
    }
    
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out`;
    
    // Forzar reflow para que la animación funcione
    element.offsetHeight;
    
    element.style.opacity = '1';
    
    // Limpiar transición después de completar
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }
  
  // Efecto de fade out
  fadeOut(element, duration = 500, remove = false) {
    return new Promise((resolve) => {
      if (this.isReducedMotion) {
        element.style.opacity = '0';
        if (remove && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        resolve();
        return;
      }
      
      element.style.transition = `opacity ${duration}ms ease-out`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.transition = '';
        if (remove && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        resolve();
      }, duration);
    });
  }
  
  // Efecto de slide in
  slideIn(element, from = 'bottom', duration = 500) {
    if (this.isReducedMotion) {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
      return;
    }
    
    const translations = {
      bottom: 'translateY(50px)',
      top: 'translateY(-50px)',
      left: 'translateX(-50px)',
      right: 'translateX(50px)'
    };
    
    element.style.transform = translations[from] || translations.bottom;
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    // Forzar reflow
    element.offsetHeight;
    
    element.style.transform = 'translate(0, 0)';
    element.style.opacity = '1';
    
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }
  
  // Efecto de texto que aparece letra por letra
  typewriter(element, text, speed = 50) {
    if (this.isReducedMotion) {
      element.textContent = text;
      return;
    }
    
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }
  
  // Efecto de brillo en elemento
  highlightElement(element, color = '#ffff00', duration = 1000) {
    if (this.isReducedMotion) return;
    
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;
    
    element.style.transition = `box-shadow ${duration}ms ease-out`;
    element.style.boxShadow = `0 0 20px ${color}, ${originalBoxShadow}`;
    
    setTimeout(() => {
      element.style.boxShadow = originalBoxShadow;
      
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration);
    }, duration);
  }
  
  // Animar barra de progreso
  animateProgressBar(progressBar, from, to, duration = 200) {
    if (this.isReducedMotion) {
      progressBar.style.width = `${to}%`;
      return;
    }
    
    const startTime = performance.now();
    const startValue = from;
    const change = to - from;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing cuadrática
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentValue = startValue + (change * easeProgress);
      progressBar.style.width = `${currentValue}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  // Crear efecto de partículas
  createParticleEffect(x, y, options = {}) {
    if (this.isReducedMotion) return;
    
    const config = {
      count: options.count || 20,
      color: options.color || '#ffffff',
      size: options.size || 4,
      speed: options.speed || 2,
      spread: options.spread || 50,
      duration: options.duration || 1000,
      ...options
    };
    
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9997;
    `;
    
    document.body.appendChild(container);
    
    for (let i = 0; i < config.count; i++) {
      this.createParticle(container, x, y, config);
    }
    
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, config.duration);
  }
  
  // Crear partícula individual
  createParticle(container, x, y, config) {
    const particle = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * config.speed;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.style.cssText = `
      position: absolute;
      width: ${config.size}px;
      height: ${config.size}px;
      background: ${config.color};
      border-radius: 50%;
      top: ${y}px;
      left: ${x}px;
      opacity: 0.8;
      will-change: transform, opacity;
    `;
    
    container.appendChild(particle);
    
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / config.duration, 1);
      
      const currentX = x + (vx * elapsed);
      const currentY = y + (vy * elapsed) + (0.5 * 0.001 * elapsed * elapsed); // gravedad
      
      particle.style.transform = `translate(${currentX}px, ${currentY}px)`;
      particle.style.opacity = 0.8 * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  // Detener todas las animaciones
  stopAllAnimations() {
    this.activeAnimations.forEach((animation) => {
      if (animation.cancel) {
        animation.cancel();
      }
    });
    this.activeAnimations.clear();
  }
  
  // Verificar si hay animaciones activas
  hasActiveAnimations() {
    return this.activeAnimations.size > 0;
  }
}

// Instancia global
export const animationManager = new AnimationManager();