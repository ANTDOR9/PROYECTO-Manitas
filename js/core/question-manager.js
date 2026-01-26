/**
 * Manejo de preguntas y respuestas
 */

import { shuffleArray } from '../utils/helpers.js';

// Banco de preguntas
const QUESTION_BANK = [
  {
    id: 1,
    question: "¿Por qué es importante lavarse las manos?",
    options: [
      "Para eliminar gérmenes y bacterias",
      "Porque huele bien el jabón",
      "Porque lo dice la mamá",
      "Para gastar agua"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 1,
    explanation: "Lavarse las manos elimina gérmenes que pueden causar enfermedades."
  },
  {
    id: 2,
    question: "¿Cuándo debemos lavarnos las manos?",
    options: [
      "Antes de comer y después de ir al baño",
      "Solo por la mañana",
      "Cuando nos acordemos",
      "Una vez al día"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 1,
    explanation: "Es esencial lavarse las manos antes de comer y después de usar el baño."
  },
  {
    id: 3,
    question: "¿Qué se necesita para lavar las manos correctamente?",
    options: [
      "Jabón y agua corriente",
      "Solo agua",
      "Perfume",
      "Alcohol gel solamente"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 1,
    explanation: "El jabón con agua es la combinación más efectiva."
  },
  {
    id: 4,
    question: "¿Cuánto tiempo debe durar el lavado de manos?",
    options: [
      "20 segundos",
      "5 segundos",
      "1 minuto",
      "10 segundos"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 1,
    explanation: "20 segundos es el tiempo recomendado para eliminar gérmenes efectivamente."
  },
  {
    id: 5,
    question: "¿Qué protegen los guantes de trabajo?",
    options: [
      "La piel de productos químicos y cortes",
      "Del frío solamente",
      "Para verse elegante",
      "De la lluvia"
    ],
    correct: 0,
    category: "Protección",
    difficulty: 2,
    explanation: "Los guantes protegen de químicos, cortes y otros riesgos laborales."
  },
  {
    id: 6,
    question: "¿Qué hacer si nos cortamos la mano trabajando?",
    options: [
      "Lavar, desinfectar y cubrir la herida",
      "Ignorarlo y seguir trabajando",
      "Poner alcohol directo sin lavar",
      "Cubrir sin lavar primero"
    ],
    correct: 0,
    category: "Primeros auxilios",
    difficulty: 2,
    explanation: "Primero limpiar, luego desinfectar y finalmente cubrir la herida."
  },
  {
    id: 7,
    question: "¿Qué debemos evitar al trabajar con herramientas?",
    options: [
      "Usar guantes rotos o dañados",
      "Lavarse las manos después",
      "Usar protección ocular",
      "Revisar las herramientas antes de usar"
    ],
    correct: 0,
    category: "Seguridad",
    difficulty: 2,
    explanation: "Los guantes rotos no ofrecen protección adecuada."
  },
  {
    id: 8,
    question: "¿Por qué mantener las uñas cortas en el trabajo?",
    options: [
      "Para evitar acumular suciedad y bacterias",
      "Por moda",
      "Por comodidad",
      "Para pintarlas mejor"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 1,
    explanation: "Las uñas largas acumulan suciedad y bacterias."
  },
  {
    id: 9,
    question: "¿Qué usar después de lavar mucho las manos?",
    options: [
      "Crema hidratante",
      "Alcohol puro",
      "Talco",
      "Perfume"
    ],
    correct: 0,
    category: "Cuidado",
    difficulty: 1,
    explanation: "La crema hidratante previene la resequedad por lavado frecuente."
  },
  {
    id: 10,
    question: "¿Qué hacer si cae producto químico en la piel?",
    options: [
      "Lavar con agua abundante inmediatamente",
      "Secar rápidamente con un trapo",
      "Frotar para que se absorba",
      "Poner más producto para neutralizar"
    ],
    correct: 0,
    category: "Emergencias",
    difficulty: 3,
    explanation: "El agua abundante ayuda a diluir y eliminar el químico."
  },
  // Añade más preguntas según necesites
];

export class QuestionManager {
  constructor() {
    this.questions = [...QUESTION_BANK];
    this.currentQuestionIndex = 0;
    this.usedQuestions = new Set();
    this.categories = this.extractCategories();
    this.shuffledQuestions = [];
  }
  
  // Extraer categorías únicas
  extractCategories() {
    const categories = new Set();
    this.questions.forEach(q => categories.add(q.category));
    return Array.from(categories);
  }
  
  // Barajar preguntas
  shuffleQuestions() {
    this.shuffledQuestions = shuffleArray([...this.questions]);
    this.currentQuestionIndex = 0;
    this.usedQuestions.clear();
    return this.shuffledQuestions;
  }
  
  // Obtener siguiente pregunta
  getNextQuestion() {
    // Si hemos usado todas las preguntas, reiniciar
    if (this.usedQuestions.size >= this.shuffledQuestions.length) {
      this.shuffleQuestions();
    }
    
    // Encontrar pregunta no usada
    let question;
    let attempts = 0;
    const maxAttempts = this.shuffledQuestions.length * 2;
    
    do {
      question = this.shuffledQuestions[this.currentQuestionIndex];
      this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.shuffledQuestions.length;
      attempts++;
    } while (this.usedQuestions.has(question.id) && attempts < maxAttempts);
    
    // Si no encontramos, usar cualquier
    if (attempts >= maxAttempts) {
      question = this.shuffledQuestions[Math.floor(Math.random() * this.shuffledQuestions.length)];
    }
    
    this.usedQuestions.add(question.id);
    return question;
  }
  
  // Verificar respuesta
  checkAnswer(questionId, selectedOption) {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return { correct: false, explanation: "Pregunta no encontrada" };
    
    const isCorrect = question.correct === selectedOption;
    return {
      correct: isCorrect,
      correctAnswer: question.correct,
      explanation: question.explanation,
      question: question.question
    };
  }
  
  // Obtener preguntas por categoría
  getQuestionsByCategory(category, limit = 10) {
    return this.questions
      .filter(q => q.category === category)
      .slice(0, limit);
  }
  
  // Obtener preguntas por dificultad
  getQuestionsByDifficulty(difficulty, limit = 10) {
    return this.questions
      .filter(q => q.difficulty === difficulty)
      .slice(0, limit);
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      totalQuestions: this.questions.length,
      categories: this.categories.length,
      difficulties: {
        easy: this.questions.filter(q => q.difficulty === 1).length,
        medium: this.questions.filter(q => q.difficulty === 2).length,
        hard: this.questions.filter(q => q.difficulty === 3).length
      }
    };
  }
  
  // Añadir pregunta dinámicamente
  addQuestion(questionData) {
    const newId = Math.max(...this.questions.map(q => q.id)) + 1;
    const newQuestion = {
      id: newId,
      ...questionData
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }
  
  // Resetear estado
  reset() {
    this.currentQuestionIndex = 0;
    this.usedQuestions.clear();
    this.shuffleQuestions();
  }
}

// Instancia global
export const questionManager = new QuestionManager();