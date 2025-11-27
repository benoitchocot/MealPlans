// Test de calcul manuel pour les quantités affichées (pour 2 portions)

// Données nutritionnelles (par 100g ou par unité)
const nutritionalData = {
  quinoa: { calories: 368, carbohydrates: 64, fats: 6, proteins: 14, fibers: 7, unit: '100g' },
  patate_douce: { calories: 86, carbohydrates: 20, fats: 0.1, proteins: 1.6, fibers: 3, unit: '100g' },
  brocoli: { calories: 34, carbohydrates: 7, fats: 0.4, proteins: 2.8, fibers: 2.6, unit: '100g' },
  pois_chiches: { calories: 364, carbohydrates: 61, fats: 6, proteins: 19, fibers: 17, unit: '100g' },
  avocat: { calories: 160, carbohydrates: 9, fats: 15, proteins: 2, fibers: 7, unit: 'piece' },
  tomate_cerise: { calories: 18, carbohydrates: 3.9, fats: 0.2, proteins: 0.9, fibers: 1.2, unit: '100g' },
  citron: { calories: 29, carbohydrates: 9, fats: 0.3, proteins: 1.1, fibers: 2.8, unit: 'piece' },
  huile_d_olive: { calories: 884, carbohydrates: 0, fats: 100, proteins: 0, fibers: 0, unit: '100g' },
  cumin: { calories: 375, carbohydrates: 44, fats: 22, proteins: 18, fibers: 11, unit: '100g' }
};

// Conversions d'unités
const unitConversions = {
  piece: {
    avocat: { to100g: 150 },
    citron: { to100g: 58 }
  },
  tbsp: {
    'huile d\'olive': { to100g: 15 }
  },
  tsp: {
    cumin: { to100g: 2 }
  }
};

function convertToGrams(name, quantity, unit) {
  if (unit === 'G') return quantity;
  if (unit === 'PIECE') {
    if (name === 'avocat') return quantity * 150;
    if (name === 'citron') return quantity * 58;
  }
  if (unit === 'TBSP') {
    if (name === 'huile d\'olive') return quantity * 15;
  }
  if (unit === 'TSP') {
    if (name === 'cumin') return quantity * 2;
  }
  return 0;
}

// Ingrédients affichés (pour 2 portions d'après les quantités)
const ingredients = [
  { name: 'quinoa', quantity: 150, unit: 'G' },
  { name: 'patate douce', quantity: 300, unit: 'G' },
  { name: 'brocoli', quantity: 200, unit: 'G' },
  { name: 'pois chiches', quantity: 200, unit: 'G' },
  { name: 'avocat', quantity: 1, unit: 'PIECE' },
  { name: 'tomate cerise', quantity: 100, unit: 'G' },
  { name: 'citron', quantity: 1, unit: 'PIECE' },
  { name: 'huile d\'olive', quantity: 2, unit: 'TBSP' },
  { name: 'cumin', quantity: 0.5, unit: 'TSP' }
];

console.log('=== CALCUL MANUEL DES VALEURS NUTRITIONNELLES ===\n');
console.log('Ingrédients (quantités affichées):');
console.log('-----------------------------------');

let totalCalories = 0;
let totalCarbs = 0;
let totalFats = 0;
let totalProteins = 0;
let totalFibers = 0;

ingredients.forEach(ing => {
  const data = nutritionalData[ing.name.replace(/ /g, '_')] || nutritionalData[ing.name];
  if (!data) {
    console.log(`${ing.name}: DONNÉES NON TROUVÉES`);
    return;
  }
  
  let calories = 0;
  let carbs = 0;
  let fats = 0;
  let proteins = 0;
  let fibers = 0;
  
  if (data.unit === '100g') {
    const grams = convertToGrams(ing.name, ing.quantity, ing.unit);
    const factor = grams / 100;
    calories = data.calories * factor;
    carbs = data.carbohydrates * factor;
    fats = data.fats * factor;
    proteins = data.proteins * factor;
    fibers = data.fibers * factor;
  } else if (data.unit === 'piece') {
    calories = data.calories * ing.quantity;
    carbs = data.carbohydrates * ing.quantity;
    fats = data.fats * ing.quantity;
    proteins = data.proteins * ing.quantity;
    fibers = data.fibers * ing.quantity;
  }
  
  totalCalories += calories;
  totalCarbs += carbs;
  totalFats += fats;
  totalProteins += proteins;
  totalFibers += fibers;
  
  console.log(`${ing.name} (${ing.quantity} ${ing.unit}): ${Math.round(calories)} kcal, ${Math.round(carbs * 10) / 10}g glucides, ${Math.round(fats * 10) / 10}g lipides, ${Math.round(proteins * 10) / 10}g protéines`);
});

console.log('\n=== TOTAL POUR TOUS LES INGRÉDIENTS ===');
console.log(`Calories: ${Math.round(totalCalories)} kcal`);
console.log(`Glucides: ${Math.round(totalCarbs * 10) / 10} g`);
console.log(`Lipides: ${Math.round(totalFats * 10) / 10} g`);
console.log(`Protéines: ${Math.round(totalProteins * 10) / 10} g`);
console.log(`Fibres: ${Math.round(totalFibers * 10) / 10} g`);

console.log('\n=== VALEURS PAR PORTION (si 2 portions) ===');
console.log(`Calories: ${Math.round(totalCalories / 2)} kcal par portion`);
console.log(`Glucides: ${Math.round((totalCarbs / 2) * 10) / 10} g par portion`);
console.log(`Lipides: ${Math.round((totalFats / 2) * 10) / 10} g par portion`);
console.log(`Protéines: ${Math.round((totalProteins / 2) * 10) / 10} g par portion`);
console.log(`Fibres: ${Math.round((totalFibers / 2) * 10) / 10} g par portion`);

console.log('\n=== VALEURS PAR PORTION (si 1 portion) ===');
console.log(`Calories: ${Math.round(totalCalories)} kcal par portion`);
console.log(`Glucides: ${Math.round(totalCarbs * 10) / 10} g par portion`);
console.log(`Lipides: ${Math.round(totalFats * 10) / 10} g par portion`);
console.log(`Protéines: ${Math.round(totalProteins * 10) / 10} g par portion`);
console.log(`Fibres: ${Math.round(totalFibers * 10) / 10} g par portion`);
