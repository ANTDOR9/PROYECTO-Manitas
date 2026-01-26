/**
 * Banco de preguntas para el juego MANITAS
 * Preguntas sobre higiene y seguridad de manos
 */

export const QUESTION_BANK = [
  // Nivel Fácil (dificultad: 1)
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
    category: "Higiene básica",
    difficulty: 1,
    explanation: "Lavarse las manos elimina gérmenes que pueden causar enfermedades como gripe, diarrea y otras infecciones."
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
    category: "Higiene básica",
    difficulty: 1,
    explanation: "Es esencial lavarse las manos antes de manipular alimentos y después de usar el baño para prevenir contagios."
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
    category: "Higiene básica",
    difficulty: 1,
    explanation: "El jabón con agua corriente es la combinación más efectiva para eliminar gérmenes."
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
    category: "Higiene básica",
    difficulty: 1,
    explanation: "20 segundos es el tiempo recomendado por la OMS para eliminar gérmenes efectivamente."
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
    difficulty: 1,
    explanation: "Los guantes protegen de químicos, cortes, abrasiones y otros riesgos laborales."
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
    difficulty: 1,
    explanation: "Primero limpiar con agua y jabón, luego desinfectar y finalmente cubrir con un apósito limpio."
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
    difficulty: 1,
    explanation: "Los guantes rotos no ofrecen protección adecuada y pueden causar accidentes."
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
    category: "Higiene personal",
    difficulty: 1,
    explanation: "Las uñas largas acumulan suciedad, bacterias y pueden romperse causando heridas."
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
    category: "Cuidado de la piel",
    difficulty: 1,
    explanation: "La crema hidratante previene la resequedad y grietas causadas por el lavado frecuente."
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
    difficulty: 1,
    explanation: "El agua abundante ayuda a diluir y eliminar el químico, minimizando el daño."
  },
  
  // Nivel Medio (dificultad: 2)
  {
    id: 11,
    question: "¿Qué tipo de guantes usar para manipular alimentos?",
    options: [
      "Guantes de nitrilo desechables",
      "Guantes de cuero",
      "Guantes de lana",
      "Guantes de látex reutilizables"
    ],
    correct: 0,
    category: "Seguridad alimentaria",
    difficulty: 2,
    explanation: "Los guantes de nitrilo desechables son ideales para alimentos, son resistentes y no causan alergias."
  },
  {
    id: 12,
    question: "¿Por qué es importante secarse bien las manos?",
    options: [
      "Porque las bacterias se propagan más en humedad",
      "Para no mojar la ropa",
      "Por comodidad",
      "Para ahorrar toallas"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 2,
    explanation: "Las manos húmedas transmiten 1000 veces más bacterias que las manos secas."
  },
  {
    id: 13,
    question: "¿Qué indica el símbolo de una mano con una herida?",
    options: [
      "Peligro de corte o amputación",
      "Lavado de manos obligatorio",
      "Usar guantes de protección",
      "Zona de primeros auxilios"
    ],
    correct: 0,
    category: "Señalización",
    difficulty: 2,
    explanation: "Es una señal de advertencia de peligro de corte, amputación o lesión en las manos."
  },
  {
    id: 14,
    question: "¿Cuándo se debe cambiar los guantes desechables?",
    options: [
      "Entre diferentes tareas o productos",
      "Al final del día",
      "Cuando se rompen visiblemente",
      "Cada 4 horas"
    ],
    correct: 0,
    category: "Buenas prácticas",
    difficulty: 2,
    explanation: "Se deben cambiar entre tareas para evitar contaminación cruzada."
  },
  {
    id: 15,
    question: "¿Qué enfermedad se previene con buen lavado de manos?",
    options: [
      "Todas las anteriores",
      "COVID-19",
      "Gripe",
      "Diarrea"
    ],
    correct: 0,
    category: "Prevención",
    difficulty: 2,
    explanation: "El lavado correcto de manos previene múltiples enfermedades infecciosas."
  },
  {
    id: 16,
    question: "¿Qué parte de las manos suele quedar sin lavar?",
    options: [
      "Las yemas de los dedos y debajo de uñas",
      "Las palmas",
      "El dorso de las manos",
      "Las muñecas"
    ],
    correct: 0,
    category: "Técnica",
    difficulty: 2,
    explanation: "Las yemas de los dedos y debajo de las uñas son áreas críticas que a menudo se olvidan."
  },
  {
    id: 17,
    question: "¿Qué tipo de guantes usar para electricidad?",
    options: [
      "Guantes dieléctricos",
      "Guantes de cuero",
      "Guantes de látex",
      "Guantes de nitrilo"
    ],
    correct: 0,
    category: "Protección eléctrica",
    difficulty: 2,
    explanation: "Los guantes dieléctricos están diseñados específicamente para trabajos eléctricos."
  },
  {
    id: 18,
    question: "¿Por qué no usar anillos trabajando con maquinaria?",
    options: [
      "Pueden atraparse y causar amputación",
      "Se pueden perder",
      "Se oxidan",
      "Molestan para mover los dedos"
    ],
    correct: 0,
    category: "Seguridad",
    difficulty: 2,
    explanation: "Los anillos pueden atraparse en maquinaria causando graves lesiones."
  },
  {
    id: 19,
    question: "¿Qué es la dermatitis de contacto?",
    options: [
      "Irritación de la piel por productos químicos",
      "Hongos en las uñas",
      "Sequedad por falta de crema",
      "Ampollas por calor"
    ],
    correct: 0,
    category: "Salud ocupacional",
    difficulty: 2,
    explanation: "Es una reacción cutánea causada por contacto con irritantes o alérgenos."
  },
  {
    id: 20,
    question: "¿Cómo se llama la técnica correcta de lavado?",
    options: [
      "Técnica de los 11 pasos de la OMS",
      "Técnica rápida de 5 segundos",
      "Técnica del agua fría",
      "Técnica sin jabón"
    ],
    correct: 0,
    category: "Técnica",
    difficulty: 2,
    explanation: "La OMS recomienda una técnica de 11 pasos para un lavado completo."
  },
  
  // Nivel Difícil (dificultad: 3)
  {
    id: 21,
    question: "¿Qué norma regula los guantes de protección?",
    options: [
      "Norma EN 388",
      "Norma ISO 9001",
      "Norma de calidad alimentaria",
      "Norma de ergonomía"
    ],
    correct: 0,
    category: "Normativa",
    difficulty: 3,
    explanation: "La norma EN 388 especifica requisitos y métodos de ensayo para guantes de protección contra riesgos mecánicos."
  },
  {
    id: 22,
    question: "¿Qué significa el pictograma de corrosión en productos químicos?",
    options: [
      "Puede causar quemaduras graves en piel",
      "Es inflamable",
      "Es tóxico si se ingiere",
      "Es peligroso para el medio ambiente"
    ],
    correct: 0,
    category: "Señalización",
    difficulty: 3,
    explanation: "Indica que el producto puede destruir tejidos vivos al contacto."
  },
  {
    id: 23,
    question: "¿Qué tipo de guante protege contra productos químicos agresivos?",
    options: [
      "Guantes de butilo",
      "Guantes de algodón",
      "Guantes de PVC",
      "Guantes de neopreno"
    ],
    correct: 0,
    category: "Protección química",
    difficulty: 3,
    explanation: "Los guantes de butilo ofrecen excelente protección contra productos químicos agresivos."
  },
  {
    id: 24,
    question: "¿Qué es la permeación en guantes de protección?",
    options: [
      "Penetración molecular del químico a nivel molecular",
      "Rotura visible del guante",
      "Absorción de líquidos por el material",
      "Degradación del material por contacto"
    ],
    correct: 0,
    category: "Tecnología",
    difficulty: 3,
    explanation: "Es el proceso por el cual un producto químico pasa a través del material a nivel molecular."
  },
  {
    id: 25,
    question: "¿Qué factor afecta la efectividad del alcohol gel?",
    options: [
      "Todas las anteriores",
      "Cantidad aplicada",
      "Tiempo de fricción",
      "Suciedad visible en manos"
    ],
    correct: 0,
    category: "Higiene",
    difficulty: 3,
    explanation: "Todos estos factores afectan la efectividad del desinfectante de manos."
  },
  {
    id: 26,
    question: "¿Qué significa el nivel de protección A en guantes químicos?",
    options: [
      "Protección por más de 480 minutos",
      "Protección básica",
      "Protección solo contra agua",
      "Protección por menos de 10 minutos"
    ],
    correct: 0,
    category: "Clasificación",
    difficulty: 3,
    explanation: "Nivel A: protección por más de 480 minutos. Es el nivel más alto."
  },
  {
    id: 27,
    question: "¿Qué bacteria común se elimina con lavado correcto?",
    options: [
      "Escherichia coli",
      "Todas son correctas",
      "Staphylococcus aureus",
      "Salmonella"
    ],
    correct: 1,
    category: "Microbiología",
    difficulty: 3,
    explanation: "El lavado correcto elimina múltiples tipos de bacterias patógenas."
  },
  {
    id: 28,
    question: "¿Qué norma sigue el lavado quirúrgico de manos?",
    options: [
      "Protocolo Asepsia Quirúrgica",
      "Norma ISO 13485",
      "Protocolo de 30 segundos",
      "Guía básica de higiene"
    ],
    correct: 0,
    category: "Protocolos",
    difficulty: 3,
    explanation: "Sigue un protocolo estricto de asepsia para procedimientos quirúrgicos."
  },
  {
    id: 29,
    question: "¿Qué elemento NO debe tener un gel desinfectante efectivo?",
    options: [
      "Colorantes y perfumes fuertes",
      "Alcohol al 70%",
      "Glicerina",
      "Agua destilada"
    ],
    correct: 0,
    category: "Productos",
    difficulty: 3,
    explanation: "Los colorantes y perfumes pueden causar irritación y no contribuyen a la desinfección."
  },
  {
    id: 30,
    question: "¿Qué significa el tiempo de breakthrough en guantes?",
    options: [
      "Tiempo hasta que el químico atraviesa el guante",
      "Tiempo de duración del guante",
      "Tiempo de resistencia al desgaste",
      "Tiempo de flexibilidad del material"
    ],
    correct: 0,
    category: "Especificaciones",
    difficulty: 3,
    explanation: "Es el tiempo que tarda un producto químico en detectarse en el interior del guante."
  },
  
  // Preguntas adicionales
  {
    id: 31,
    question: "¿Qué hacer si el jabón irrita las manos?",
    options: [
      "Usar jabón hipoalergénico y crema después",
      "Dejar de lavarse las manos",
      "Usar solo agua",
      "Lavarse menos veces"
    ],
    correct: 0,
    category: "Cuidado",
    difficulty: 1,
    explanation: "Cambiar a jabón hipoalergénico y usar crema hidratante previene irritaciones."
  },
  {
    id: 32,
    question: "¿Por qué no se debe usar guantes de látex con algunos productos?",
    options: [
      "Algunos químicos degradan el látex rápidamente",
      "Son más caros",
      "Son menos cómodos",
      "No existen razones"
    ],
    correct: 0,
    category: "Materiales",
    difficulty: 2,
    explanation: "Ciertos solventes y químicos degradan el látex rápidamente, reduciendo su protección."
  },
  
{
    id: 33,
    question: "¿Qué es la contaminación cruzada?",
    options: [
      "Transferencia de gérmenes entre superficies",
      "Mezcla de productos químicos",
      "Uso incorrecto de guantes",
      "Lavado insuficiente"
    ],
    correct: 0,
    category: "Seguridad alimentaria",
    difficulty: 2,
    explanation: "Es la transferencia de microorganismos patógenos de alimentos crudos a cocinados, o de superficies contaminadas a alimentos, pudiendo causar intoxicaciones alimentarias."
}


  // Continuación de preguntas adicionales
{
    id: 34,
    question: "¿Cuál es la temperatura ideal del agua para lavado de manos?",
    options: [
      "Tibia, ni muy caliente ni muy fría",
      "Muy caliente para matar gérmenes",
      "Solo fría para ahorrar energía",
      "Cualquier temperatura sirve igual"
    ],
    correct: 0,
    category: "Técnica",
    difficulty: 2,
    explanation: "El agua tibia es más efectiva para disolver grasas y suciedad sin dañar la piel."
    },

{
    id: 35,
    question: "¿Qué significa que un guante tenga nivel 4 de resistencia a cortes?",
    options: [
      "Resiste cortes por cuchilla con fuerza de 5 newtons",
      "Es resistente al agua",
      "Es ignífugo",
      "Tiene protección química máxima"
    ],
    correct: 0,
    category: "Especificaciones",
    difficulty: 3,
    explanation: "Nivel 4 indica alta resistencia a cortes (índice de 10 a 14.9 en escala EN 388)."
  },
  {
    id: 36,
    question: "¿Por qué es importante la ergonomía en los guantes?",
    options: [
      "Previene fatiga y lesiones por movimientos repetitivos",
      "Los hace más baratos",
      "Solo por estética",
      "Para que sean más delgados"
    ],
    correct: 0,
    category: "Ergonomía",
    difficulty: 2,
    explanation: "Un diseño ergonómico reduce la fatiga muscular y previene lesiones."
  },
  {
    id: 37,
    question: "¿Qué hacer si se tiene alergia al látex?",
    options: [
      "Usar guantes de nitrilo o vinilo",
      "Usar talco adicional",
      "Usar doble guante de látex",
      "No usar guantes"
    ],
    correct: 0,
    category: "Salud",
    difficulty: 1,
    explanation: "El nitrilo y vinilo son alternativas seguras para personas con alergia al látex."
  },
  {
    id: 38,
    question: "¿Cuánto tiempo sobreviven algunos virus en las manos?",
    options: [
      "Hasta 2 horas en superficies contaminadas",
      "Solo unos segundos",
      "Varios días",
      "No sobreviven fuera del cuerpo"
    ],
    correct: 0,
    category: "Microbiología",
    difficulty: 3,
    explanation: "Algunos virus pueden sobrevivir en superficies hasta 2 horas, por eso el lavado frecuente es crucial."
  },
  {
    id: 39,
    question: "¿Qué indica un guante con resistencia a abrasión nivel 3?",
    options: [
      "Resiste entre 1000 y 2000 ciclos de abrasión",
      "Es completamente anti-abrasión",
      "Solo para uso ligero",
      "Para productos químicos solamente"
    ],
    correct: 0,
    category: "Especificaciones",
    difficulty: 3,
    explanation: "Nivel 3: resistencia media (1000-2000 ciclos en prueba Martindale)."
  },
  {
    id: 40,
    question: "¿Por qué lavarse las manos previene enfermedades respiratorias?",
    options: [
      "Porque tocamos nuestra cara constantemente",
      "El jabón mata virus en el aire",
      "El agua fría fortalece el sistema inmune",
      "No hay relación comprobada"
    ],
    correct: 0,
    category: "Prevención",
    difficulty: 2,
    explanation: "Tocamos nuestra cara unas 23 veces por hora, transfiriendo gérmenes de las manos a mucosas."
  },
  {
    id: 41,
    question: "¿Qué tipo de guante es mejor para trabajos de precisión?",
    options: [
      "Guantes con textura y buena sensibilidad táctil",
      "Guantes gruesos de cuero",
      "Guantes extra grandes",
      "Cualquier guante sirve igual"
    ],
    correct: 0,
    category: "Aplicaciones",
    difficulty: 2,
    explanation: "Los guantes con textura fina y buen ajuste ofrecen mejor destreza para trabajos de precisión."
  },
  {
    id: 42,
    question: "¿Qué hacer con los guantes después de usarlos?",
    options: [
      "Desechar correctamente los desechables, limpiar los reutilizables",
      "Guardarlos en el bolsillo para usar después",
      "Lavarlos con agua solamente",
      "Dejarlos en cualquier lugar"
    ],
    correct: 0,
    category: "Buenas prácticas",
    difficulty: 1,
    explanation: "Los desechables deben tirarse tras un uso, los reutilizables limpiarse según instrucciones."
  },
  {
    id: 43,
    question: "¿Por qué usar guantes de diferentes colores en cocina?",
    options: [
      "Para evitar contaminación cruzada entre alimentos",
      "Por estética y moda",
      "Son más baratos así",
      "No hay razón específica"
    ],
    correct: 0,
    category: "Seguridad alimentaria",
    difficulty: 2,
    explanation: "El código de colores (rojo para carnes crudas, verde para vegetales, etc.) previene contaminación."
  },
  {
    id: 44,
    question: "¿Qué porcentaje de alcohol debe tener un desinfectante efectivo?",
    options: [
      "Entre 60% y 80%",
      "100% puro",
      "Menos del 40%",
      "Cualquier porcentaje sirve"
    ],
    correct: 0,
    category: "Productos",
    difficulty: 2,
    explanation: "El alcohol entre 60-80% es más efectivo, ya que necesita algo de agua para penetrar en gérmenes."
  },
  {
    id: 45,
    question: "¿Qué significa el símbolo de una mano dentro de un círculo?",
    options: [
      "Obligación de usar protección en manos",
      "Prohibido tocar",
      "Lavado de manos disponible",
      "Zona de peligro químico"
    ],
    correct: 0,
    category: "Señalización",
    difficulty: 2,
    explanation: "Indica obligatoriedad de usar protección en las manos en esa área."
  },
  {
    id: 46,
    question: "¿Por qué algunas cremas para manos tienen protección solar?",
    options: [
      "Porque las manos están expuestas al sol frecuentemente",
      "Solo es un truco de marketing",
      "Porque el sol seca el jabón",
      "Para que brillen más"
    ],
    correct: 0,
    category: "Cuidado",
    difficulty: 1,
    explanation: "Las manos están entre las zonas más expuestas al sol, aumentando riesgo de cáncer de piel."
  },
  {
    id: 47,
    question: "¿Qué tipo de guante es más resistente a aceites y grasas?",
    options: [
      "Guantes de nitrilo",
      "Guantes de algodón",
      "Guantes de látex",
      "Guantes de PVC"
    ],
    correct: 0,
    category: "Materiales",
    difficulty: 2,
    explanation: "El nitrilo tiene excelente resistencia a aceites, grasas y muchos productos químicos."
  },
  {
    id: 48,
    question: "¿Cuál es el error más común al usar gel desinfectante?",
    options: [
      "No frotar las manos el tiempo suficiente",
      "Usar demasiado producto",
      "Aplicarlo solo en palmas",
      "Usarlo con las manos sucias visiblemente"
    ],
    correct: 0,
    category: "Técnica",
    difficulty: 1,
    explanation: "Se debe frotar hasta que las manos estén completamente secas (20-30 segundos)."
  },
  {
    id: 49,
    question: "¿Qué indica el factor de desgaste en guantes?",
    options: [
      "Cuantos ciclos de lavado aguanta",
      "Qué tan rápido se rompe",
      "Cuánto protege del frío",
      "Su nivel de impermeabilidad"
    ],
    correct: 0,
    category: "Durabilidad",
    difficulty: 3,
    explanation: "Indica cuántos ciclos de lavado industrial puede soportar sin perder propiedades."
  },
  {
    id: 50,
    question: "¿Por qué es importante la talla correcta de guantes?",
    options: [
      "Mejor destreza y menos fatiga",
      "Solo por comodidad",
      "Para que queden más bonitos",
      "Las tallas no importan realmente"
    ],
    correct: 0,
    category: "Ergonomía",
    difficulty: 1,
    explanation: "Guantes muy grandes reducen destreza, muy pequeños causan fatiga y pueden romperse."
  }
];

// Estadísticas del banco de preguntas
export const QUESTION_STATS = {
  totalQuestions: QUESTION_BANK.length,
  byDifficulty: {
    easy: QUESTION_BANK.filter(q => q.difficulty === 1).length,
    medium: QUESTION_BANK.filter(q => q.difficulty === 2).length,
    hard: QUESTION_BANK.filter(q => q.difficulty === 3).length
  },
  byCategory: (() => {
    const categories = {};
    QUESTION_BANK.forEach(q => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });
    return categories;
  })()
};

// Funciones auxiliares para manejar preguntas
export function getQuestionsByCategory(category, limit = 10) {
  return QUESTION_BANK
    .filter(q => q.category === category)
    .slice(0, limit);
}

export function getQuestionsByDifficulty(difficulty, limit = 10) {
  return QUESTION_BANK
    .filter(q => q.difficulty === difficulty)
    .slice(0, limit);
}

export function getRandomQuestions(count = 10) {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionById(id) {
  return QUESTION_BANK.find(q => q.id === id);
}