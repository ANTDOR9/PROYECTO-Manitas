/**
 * Gestión de la interfaz de usuario
 */

import { isMobileDevice, isTouchDevice, debounce } from '../utils/helpers.js';
import { animationManager } from './animation-manager.js';

export class UIManager {
  constructor() {
    this.elements = new Map();
    this.eventListeners = new Map();
    this.currentScreen = null;
    this.isMobile = isMobileDevice();
    this.isTouch = isTouchDevice();
    this.uiState = {
      isAnimating: false,
      isModalOpen: false,
      currentView: 'game'
    };
    
    // Cache para elementos frecuentes
    this.cache = new Map();
    
    // Configurar eventos globales
    this.setupGlobalEvents();
  }
  
  // Configurar eventos globales
  setupGlobalEvents() {
    // Manejar cambios de tamaño de ventana
    const handleResize = debounce(() => {
      this.handleResize();
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Prevenir zoom en dispositivos táctiles con doble tap
    if (this.isTouch) {
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, { passive: false });
    }
    
    // Manejar teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }
  
  // Manejar cambios de tamaño
  handleResize() {
    // Actualizar clases responsivas
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-view');
      document.body.classList.remove('tablet-view', 'desktop-view');
    } else if (window.innerWidth < 1024) {
      document.body.classList.add('tablet-view');
      document.body.classList.remove('mobile-view', 'desktop-view');
    } else {
      document.body.classList.add('desktop-view');
      document.body.classList.remove('mobile-view', 'tablet-view');
    }
    
    // Recalcular posiciones de elementos flotantes
    this.repositionFloatingElements();
  }
  
  // Reposicionar elementos flotantes
  repositionFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-floating]');
    floatingElements.forEach(el => {
      const config = JSON.parse(el.dataset.floating || '{}');
      this.positionElement(el, config);
    });
  }
  
  // Posicionar elemento según configuración
  positionElement(element, config) {
    const { position = 'top-right', margin = 20 } = config;
    
    switch(position) {
      case 'top-right':
        element.style.top = `${margin}px`;
        element.style.right = `${margin}px`;
        element.style.left = 'auto';
        break;
      case 'top-left':
        element.style.top = `${margin}px`;
        element.style.left = `${margin}px`;
        element.style.right = 'auto';
        break;
      case 'bottom-right':
        element.style.bottom = `${margin}px`;
        element.style.right = `${margin}px`;
        element.style.top = 'auto';
        break;
      case 'bottom-left':
        element.style.bottom = `${margin}px`;
        element.style.left = `${margin}px`;
        element.style.top = 'auto';
        break;
      case 'center':
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        break;
    }
  }
  
  // Registrar elemento UI
  registerElement(key, element, options = {}) {
    this.elements.set(key, {
      element,
      options,
      eventListeners: new Map()
    });
    
    if (options.className) {
      element.classList.add(options.className);
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([attr, value]) => {
        element.setAttribute(attr, value);
      });
    }
    
    return element;
  }
  
  // Obtener elemento registrado
  getElement(key) {
    const entry = this.elements.get(key);
    return entry ? entry.element : null;
  }
  
  // Mostrar elemento
  showElement(key, animate = true) {
    const element = this.getElement(key);
    if (!element) return;
    
    element.style.display = 'block';
    
    if (animate) {
      animationManager.fadeIn(element);
    } else {
      element.style.opacity = '1';
    }
  }
  
  // Ocultar elemento
  hideElement(key, animate = true) {
    const element = this.getElement(key);
    if (!element) return;
    
    if (animate) {
      animationManager.fadeOut(element, 300, false).then(() => {
        element.style.display = 'none';
      });
    } else {
      element.style.display = 'none';
      element.style.opacity = '0';
    }
  }
  
  // Cambiar texto de elemento
  setText(key, text, animate = false) {
    const element = this.getElement(key);
    if (!element) return;
    
    if (animate) {
      animationManager.typewriter(element, text);
    } else {
      element.textContent = text;
    }
  }
  
  // Cambiar HTML de elemento
  setHTML(key, html) {
    const element = this.getElement(key);
    if (!element) return;
    
    element.innerHTML = html;
  }
  
  // Cambiar clase de elemento
  setClass(key, className, add = true) {
    const element = this.getElement(key);
    if (!element) return;
    
    if (add) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
  
  // Cambiar atributo de elemento
  setAttribute(key, attribute, value) {
    const element = this.getElement(key);
    if (!element) return;
    
    element.setAttribute(attribute, value);
  }
  
  // Agregar evento a elemento
  addEvent(key, event, handler, options = {}) {
    const entry = this.elements.get(key);
    if (!entry) return;
    
    const wrappedHandler = (e) => {
      if (this.uiState.isAnimating && options.skipDuringAnimation) return;
      handler(e);
    };
    
    entry.element.addEventListener(event, wrappedHandler, options);
    entry.eventListeners.set(event, wrappedHandler);
  }
  
  // Remover evento de elemento
  removeEvent(key, event) {
    const entry = this.elements.get(key);
    if (!entry) return;
    
    const handler = entry.eventListeners.get(event);
    if (handler) {
      entry.element.removeEventListener(event, handler);
      entry.eventListeners.delete(event);
    }
  }
  
  // Crear botón
  createButton(text, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `ui-button ${options.className || ''}`;
    
    if (options.id) {
      button.id = options.id;
    }
    
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    
    // Efectos hover para desktop
    if (!this.isTouch) {
      button.addEventListener('mouseenter', () => {
        animationManager.pulseElement(button, 1.05);
      });
    }
    
    // Efecto click
    button.addEventListener('mousedown', () => {
      animationManager.pulseElement(button, 0.95, 150);
    });
    
    return button;
  }
  
  // Crear tarjeta
  createCard(content, options = {}) {
    const card = document.createElement('div');
    card.className = `ui-card ${options.className || ''}`;
    
    if (typeof content === 'string') {
      card.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      card.appendChild(content);
    } else if (Array.isArray(content)) {
      content.forEach(item => {
        if (item instanceof HTMLElement) {
          card.appendChild(item);
        } else {
          card.innerHTML += item;
        }
      });
    }
    
    return card;
  }
  
  // Mostrar modal
  showModal(title, content, options = {}) {
    this.uiState.isModalOpen = true;
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
      color: white;
      padding: 2rem;
      border-radius: 20px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      border: 2px solid #00bfa5;
    `;
    
    // Título
    if (title) {
      const titleEl = document.createElement('h2');
      titleEl.textContent = title;
      titleEl.style.cssText = `
        margin-bottom: 1rem;
        color: #00bfa5;
        text-align: center;
      `;
      modal.appendChild(titleEl);
    }
    
    // Contenido
    if (content) {
      const contentEl = document.createElement('div');
      if (typeof content === 'string') {
        contentEl.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        contentEl.appendChild(content);
      }
      modal.appendChild(contentEl);
    }
    
    // Botón de cerrar
    const closeButton = this.createButton(options.closeText || 'Cerrar', {
      onClick: () => this.hideModal(overlay)
    });
    closeButton.style.cssText = `
      display: block;
      margin: 1.5rem auto 0;
      padding: 0.75rem 2rem;
      background: linear-gradient(45deg, #ff0000, #ff8800);
    `;
    
    modal.appendChild(closeButton);
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && options.closeOnOverlayClick !== false) {
        this.hideModal(overlay);
      }
    });
    
    // Cerrar con ESC
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideModal(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animar entrada
    animationManager.fadeIn(overlay);
    animationManager.slideIn(modal, 'bottom');
    
    return {
      overlay,
      modal,
      close: () => this.hideModal(overlay)
    };
  }
  
  // Ocultar modal
  hideModal(overlay) {
    this.uiState.isModalOpen = false;
    
    animationManager.fadeOut(overlay, 300, true);
  }
  
  // Mostrar notificación toast
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `ui-toast ui-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getToastColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      transform: translateX(150%);
      transition: transform 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remover
    setTimeout(() => {
      toast.style.transform = 'translateX(150%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    return toast;
  }
  
  // Obtener color para toast según tipo
  getToastColor(type) {
    const colors = {
      success: 'linear-gradient(45deg, #00bfa5, #00e0b5)',
      error: 'linear-gradient(45deg, #ff0000, #ff4444)',
      warning: 'linear-gradient(45deg, #ffcc00, #ffdd44)',
      info: 'linear-gradient(45deg, #2196F3, #21CBF3)'
    };
    return colors[type] || colors.info;
  }
  
  // Actualizar puntaje en pantalla
  updateScoreDisplay(score, elementKey = 'scoreDisplay') {
    const element = this.getElement(elementKey);
    if (element) {
      animationManager.pulseElement(element, 1.2, 200);
      this.setText(elementKey, score.toString());
    }
  }
  
  // Actualizar racha en pantalla
  updateStreakDisplay(streak, elementKey = 'streakDisplay') {
    const element = this.getElement(elementKey);
    if (element) {
      if (streak % 3 === 0 && streak > 0) {
        animationManager.highlightElement(element, '#ffff00', 1000);
      }
      this.setText(elementKey, streak.toString());
    }
  }
  
  // Mostrar feedback de respuesta
  showAnswerFeedback(isCorrect, message = '') {
    const feedback = this.createElement('div', {
      className: `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`,
      text: message || (isCorrect ? '¡Correcto! ✅' : 'Incorrecto ❌'),
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        padding: '1rem 2rem',
        borderRadius: '15px',
        zIndex: '9999',
        background: isCorrect ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }
    });
    
    document.body.appendChild(feedback);
    
    // Animar y remover
    animationManager.fadeIn(feedback);
    
    setTimeout(() => {
      animationManager.fadeOut(feedback, 500, true);
    }, 1500);
  }
  
  // Crear elemento con configuración
  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) {
      element.className = options.className;
    }
    
    if (options.id) {
      element.id = options.id;
    }
    
    if (options.text) {
      element.textContent = options.text;
    }
    
    if (options.html) {
      element.innerHTML = options.html;
    }
    
    if (options.style) {
      Object.assign(element.style, options.style);
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.children) {
      options.children.forEach(child => {
        if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }
    
    if (options.onClick) {
      element.addEventListener('click', options.onClick);
    }
    
    return element;
  }
  
  // Manejar atajos de teclado
  handleKeyboardShortcuts(e) {
    // Solo si no hay input activo
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
      case ' ':
      case 'Enter':
        // Simular clic en botón de enviar
        const sendBtn = this.getElement('sendBtn');
        if (sendBtn && !this.uiState.isModalOpen) {
          e.preventDefault();
          sendBtn.click();
        }
        break;
      case 'Escape':
        // Cerrar modales
        if (this.uiState.isModalOpen) {
          const modal = document.querySelector('.modal-overlay');
          if (modal) {
            this.hideModal(modal);
          }
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        // Seleccionar opción por número
        if (!this.uiState.isModalOpen) {
          const index = parseInt(e.key) - 1;
          this.selectOptionByIndex(index);
        }
        break;
    }
  }
  
  // Seleccionar opción por índice
  selectOptionByIndex(index) {
    const options = document.querySelectorAll('.game-option-btn');
    if (options[index]) {
      options[index].click();
    }
  }
  
  // Limpiar interfaz
  clear() {
    // Remover event listeners
    this.elements.forEach(entry => {
      entry.eventListeners.forEach((handler, event) => {
        entry.element.removeEventListener(event, handler);
      });
    });
    
    this.elements.clear();
    this.eventListeners.clear();
    this.cache.clear();
  }
}

// Instancia global
export const uiManager = new UIManager();