// Test du calcul de l'huile d'olive
const huileOlive = { calories: 884, unit: 'tbsp' };
const quantity = 4; // 4 cuillères à soupe

// Si unit est 'tbsp', on utilise directement la valeur par unité
const calories = huileOlive.calories * quantity;
console.log(`Huile d'olive: ${quantity} TBSP = ${calories} kcal`);

// MAIS 884 kcal par TBSP est ÉNORME ! 
// 1 TBSP d'huile = 15ml = ~133 kcal
// 4 TBSP = 532 kcal, pas 3536 kcal !

console.log('\nLe problème: l\'huile d\'olive a unit: "tbsp" avec 884 kcal');
console.log('Mais 884 kcal est pour 100g, pas pour 1 TBSP !');
console.log('1 TBSP = 15g, donc = 884 * 0.15 = 133 kcal');
