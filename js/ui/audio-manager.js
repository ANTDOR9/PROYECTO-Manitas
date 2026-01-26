/**
 * Gestión avanzada de audio para el juego
 */

import { loadSettings, saveSettings } from '../utils/storage.js';

export class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = null;
    this.isMuted = false;
    this.globalVolume = 0.5;
    this.soundVolume = 0.7;
    this.musicVolume = 0.3;
    this.audioContext = null;
    this.enabled = true;
    
    // Cargar configuración
    this.loadConfig();
    
    // Prevenir bloqueo de autoplay
    this.setupAutoplayHandler();
    
    // Cache para evitar crear múltiples instancias
    this.soundCache = new Map();
  }
  
  // Cargar configuración
  loadConfig() {
    try {
      const settings = loadSettings();
      this.globalVolume = settings.volume || 0.5;
      this.soundVolume = settings.soundVolume || 0.7;
      this.musicVolume = settings.musicVolume || 0.3;
      this.isMuted = !settings.sound;
      this.enabled = settings.sound !== false;
    } catch (error) {
      console.warn('No se pudo cargar configuración de audio:', error);
    }
  }
  
  // Guardar configuración
  saveConfig() {
    const settings = {
      sound: !this.isMuted,
      volume: this.globalVolume,
      soundVolume: this.soundVolume,
      musicVolume: this.musicVolume
    };
    saveSettings(settings);
  }
  
  // Configurar manejador de autoplay
  setupAutoplayHandler() {
    // Intentar reproducir algo pequeño para desbloquear audio
    const unlockAudio = () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Crear y reproducir un sonido silencioso
      const silentSound = new Audio();
      silentSound.volume = 0.001;
      silentSound.play().catch(() => {});
      
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
  }
  
  // Crear AudioContext (para efectos avanzados)
  createAudioContext() {
    if (!this.audioContext && window.AudioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }
  
  // Precargar sonido
  async preloadSound(key, url) {
    if (this.soundCache.has(key)) {
      return this.soundCache.get(key);
    }
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      if (this.audioContext) {
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.soundCache.set(key, audioBuffer);
        return audioBuffer;
      } else {
        // Fallback a Audio element
        const audio = new Audio(url);
        audio.load();
        this.soundCache.set(key, audio);
        return audio;
      }
    } catch (error) {
      console.error(`Error preloading sound ${key}:`, error);
      return null;
    }
  }
  
  // Registrar sonido
  registerSound(key, url, options = {}) {
    const sound = {
      url,
      audio: null,
      isLoaded: false,
      volume: options.volume || 1.0,
      loop: options.loop || false,
      playbackRate: options.playbackRate || 1.0
    };
    
    this.sounds.set(key, sound);
    
    // Precargar
    this.preloadSound(key, url).then(audio => {
      sound.audio = audio;
      sound.isLoaded = true;
    });
    
    return sound;
  }
  
  // Reproducir sonido
  playSound(key, options = {}) {
    if (!this.enabled || this.isMuted) return null;
    
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound "${key}" not registered`);
      return null;
    }
    
    let audioInstance;
    
    if (sound.audio instanceof Audio) {
      // Usar Audio element
      audioInstance = sound.audio.cloneNode();
      audioInstance.volume = this.calculateVolume(sound.volume, options.volume);
      audioInstance.playbackRate = options.playbackRate || sound.playbackRate;
      audioInstance.loop = options.loop || sound.loop;
      
      audioInstance.play().catch(error => {
        console.warn(`Could not play sound "${key}":`, error);
      });
    } else if (sound.audio && this.audioContext) {
      // Usar AudioBuffer
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = sound.audio;
      source.playbackRate.value = options.playbackRate || sound.playbackRate;
      source.loop = options.loop || sound.loop;
      
      gainNode.gain.value = this.calculateVolume(sound.volume, options.volume);
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
      audioInstance = source;
    }
    
    // Manejar finalización
    if (audioInstance && !options.loop) {
      const cleanup = () => {
        if (audioInstance instanceof Audio) {
          audioInstance.removeEventListener('ended', cleanup);
        } else {
          audioInstance.onended = null;
        }
      };
      
      if (audioInstance instanceof Audio) {
        audioInstance.addEventListener('ended', cleanup);
      } else {
        audioInstance.onended = cleanup;
      }
    }
    
    return audioInstance;
  }
  
  // Reproducir música
  playMusic(key, options = {}) {
    if (this.music) {
      this.stopMusic();
    }
    
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Music "${key}" not registered`);
      return null;
    }
    
    this.music = this.playSound(key, {
      ...options,
      loop: true,
      volume: this.musicVolume
    });
    
    return this.music;
  }
  
  // Detener música
  stopMusic() {
    if (this.music) {
      if (this.music instanceof Audio) {
        this.music.pause();
        this.music.currentTime = 0;
      } else if (this.music.stop) {
        this.music.stop();
      }
      this.music = null;
    }
  }
  
  // Pausar todos los sonidos
  pauseAll() {
    this.sounds.forEach(sound => {
      if (sound.audio instanceof Audio && !sound.audio.paused) {
        sound.audio.pause();
      }
    });
    
    if (this.music instanceof Audio) {
      this.music.pause();
    }
  }
  
  // Reanudar todos los sonidos
  resumeAll() {
    if (!this.enabled || this.isMuted) return;
    
    this.sounds.forEach(sound => {
      if (sound.audio instanceof Audio && sound.audio.paused) {
        sound.audio.play().catch(() => {});
      }
    });
    
    if (this.music instanceof Audio && this.music.paused) {
      this.music.play().catch(() => {});
    }
  }
  
  // Silenciar/Desilenciar
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.pauseAll();
    } else {
      this.resumeAll();
    }
    
    this.saveConfig();
    return this.isMuted;
  }
  
  // Cambiar volumen global
  setGlobalVolume(volume) {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.saveConfig();
  }
  
  // Cambiar volumen de efectos
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.saveConfig();
  }
  
  // Cambiar volumen de música
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    if (this.music instanceof Audio) {
      this.music.volume = this.calculateVolume(this.musicVolume);
    }
    
    this.saveConfig();
  }
  
  // Calcular volumen final
  calculateVolume(baseVolume = 1.0, overrideVolume = 1.0) {
    if (!this.enabled || this.isMuted) return 0;
    return this.globalVolume * this.soundVolume * baseVolume * overrideVolume;
  }
  
  // Crear efecto de sonido programático
  createTone(frequency = 440, duration = 0.1, type = 'sine') {
    if (!this.enabled || this.isMuted || !this.audioContext) return null;
    
    const audioContext = this.createAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(this.calculateVolume(), audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    return oscillator;
  }
  
  // Sonido de respuesta correcta
  playCorrectSound() {
    return this.playSound('correct', { volume: 0.8 });
  }
  
  // Sonido de respuesta incorrecta
  playWrongSound() {
    return this.playSound('wrong', { volume: 0.8 });
  }
  
  // Sonido de click
  playClickSound() {
    return this.playSound('click', { volume: 0.3 });
  }
  
  // Sonido de racha
  playStreakSound() {
    return this.playSound('streak', { volume: 0.9 });
  }
  
  // Habilitar/Deshabilitar audio
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.pauseAll();
    }
    this.saveConfig();
  }
  
  // Obtener estado
  getStatus() {
    return {
      enabled: this.enabled,
      muted: this.isMuted,
      globalVolume: this.globalVolume,
      soundVolume: this.soundVolume,
      musicVolume: this.musicVolume,
      soundsLoaded: Array.from(this.sounds.values()).filter(s => s.isLoaded).length,
      totalSounds: this