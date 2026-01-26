/**
 * Manejo de almacenamiento local
 */

const STORAGE_KEY = 'manitas_game_data';

// Datos por defecto
const defaultData = {
  highScore: 0,
  totalGames: 0,
  totalCorrect: 0,
  totalTime: 0,
  achievements: [],
  settings: {
    sound: true,
    music: true,
    volume: 0.5,
    difficulty: 'normal',
    showTimer: true
  },
  stats: {
    bestStreak: 0,
    averageScore: 0,
    favoriteCategory: null,
    lastPlayed: null
  }
};

// Inicializar o cargar datos
export function loadGameData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Merge con datos por defecto para nuevas propiedades
      return { ...defaultData, ...parsed };
    }
  } catch (error) {
    console.error('Error loading game data:', error);
  }
  return { ...defaultData };
}

// Guardar datos
export function saveGameData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving game data:', error);
    return false;
  }
}

// Actualizar puntaje alto
export function updateHighScore(score) {
  const data = loadGameData();
  if (score > data.highScore) {
    data.highScore = score;
    data.stats.bestStreak = Math.max(data.stats.bestStreak, score);
    saveGameData(data);
    return true;
  }
  return false;
}

// Registrar juego completado
export function registerGame(correct, total, time) {
  const data = loadGameData();
  
  data.totalGames++;
  data.totalCorrect += correct;
  data.totalTime += time;
  data.stats.averageScore = Math.round(data.totalCorrect / data.totalGames);
  data.stats.lastPlayed = new Date().toISOString();
  
  if (correct > data.stats.bestStreak) {
    data.stats.bestStreak = correct;
  }
  
  saveGameData(data);
  return data;
}

// Guardar configuración
export function saveSettings(settings) {
  const data = loadGameData();
  data.settings = { ...data.settings, ...settings };
  saveGameData(data);
  return data.settings;
}

// Cargar configuración
export function loadSettings() {
  const data = loadGameData();
  return data.settings;
}

// Limpiar datos del juego
export function clearGameData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game data:', error);
    return false;
  }
}

// Exportar datos
export function exportGameData() {
  const data = loadGameData();
  return JSON.stringify(data, null, 2);
}

// Importar datos
export function importGameData(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    saveGameData(imported);
    return true;
  } catch (error) {
    console.error('Error importing game data:', error);
    return false;
  }
}

// Verificar espacio disponible
export function getStorageSpace() {
  let total = 0;
  let used = 0;
  
  try {
    // Calcular espacio usado
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const amount = (localStorage[key].length * 2) / 1024 / 1024; // MB
        used += amount;
      }
    }
    
    // Estimación del total (5MB típico)
    total = 5; // 5MB
  } catch (e) {
    console.error('Error calculating storage:', e);
  }
  
  return { used: used.toFixed(2), total, free: (total - used).toFixed(2) };
}

// Cache para preguntas frecuentes
export class GameCache {
  constructor(namespace = 'game_cache') {
    this.namespace = namespace;
    this.cache = this.loadCache();
  }
  
  loadCache() {
    try {
      const cached = localStorage.getItem(this.namespace);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }
  
  set(key, value, ttl = 3600000) { // 1 hora por defecto
    this.cache[key] = {
      value,
      expires: Date.now() + ttl
    };
    this.saveCache();
  }
  
  get(key) {
    const item = this.cache[key];
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      delete this.cache[key];
      this.saveCache();
      return null;
    }
    
    return item.value;
  }
  
  delete(key) {
    delete this.cache[key];
    this.saveCache();
  }
  
  clear() {
    this.cache = {};
    this.saveCache();
  }
  
  saveCache() {
    try {
      localStorage.setItem(this.namespace, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }
}

// Instancia global del cache
export const gameCache = new GameCache();