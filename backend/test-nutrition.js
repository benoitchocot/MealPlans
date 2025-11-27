// Test de calcul nutritionnel pour Buddha Bowl
const { calculateNutritionalValues } = require('./dist/src/utils/nutrition-calculator');

const ingredients = [
  { name: 'quinoa', quantity: 300, unit: 'G' },
  { name: 'patate douce', quantity: 600, unit: 'G' },
  { name: 'brocoli', quantity: 400, unit: 'G' },
  { name: 'pois chiches', quantity: 400, unit: 'G' },
  { name: 'avocat', quantity: 2, unit: 'PIECE' },
  { name: 'tomate cerise', quantity: 200, unit: 'G' },
  { name: 'citron', quantity: 2, unit: 'PIECE' },
  { name: 'huile d\'olive', quantity: 4, unit: 'TBSP' },
  { name: 'cumin', quantity: 1, unit: 'TSP' }
];

const servings = 4;

console.log('Test du calcul nutritionnel pour Buddha Bowl:');
console.log('Ingrédients pour', servings, 'portions');
console.log('');

try {
  const result = calculateNutritionalValues(ingredients, servings);
  console.log('Résultat:', result);
  console.log('');
  console.log('Calories par portion:', result.calories);
  console.log('Si on obtient 1884 kcal, il y a un problème !');
} catch (e) {
  console.error('Erreur:', e.message);
}
