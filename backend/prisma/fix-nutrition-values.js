/**
 * Script pour corriger automatiquement toutes les valeurs nutritionnelles
 * dans les fichiers seed en les recalculant à partir des ingrédients
 */

const fs = require('fs');
const path = require('path');

// Charger les données nutritionnelles depuis le fichier TS
function loadNutritionalData() {
    const filePath = path.join(__dirname, 'nutritional-data.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    const data = {};
    const conversions = {
        piece: {},
        tbsp: {},
        tsp: {},
        clove: {},
        bunch: {},
        slice: {},
    };
    
    // Extraire les données nutritionnelles (simplifié mais fonctionnel)
    const dataRegex = /['"]([^'"]+)['"]:\s*\{[^}]*calories:\s*(\d+(?:\.\d+)?)[^}]*carbohydrates:\s*(\d+(?:\.\d+)?)[^}]*fats:\s*(\d+(?:\.\d+)?)[^}]*proteins:\s*(\d+(?:\.\d+)?)[^}]*fibers:\s*(\d+(?:\.\d+)?)[^}]*unit:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = dataRegex.exec(content)) !== null) {
        const name = match[1];
        data[name] = {
            calories: parseFloat(match[2]),
            carbohydrates: parseFloat(match[3]),
            fats: parseFloat(match[4]),
            proteins: parseFloat(match[5]),
            fibers: parseFloat(match[6]),
            unit: match[7],
        };
    }
    
    // Extraire les conversions d'unités
    const convSections = {
        piece: /piece:\s*\{([^}]+)\}/,
        tbsp: /tbsp:\s*\{([^}]+)\}/,
        tsp: /tsp:\s*\{([^}]+)\}/,
        clove: /clove:\s*\{([^}]+)\}/,
        bunch: /bunch:\s*\{([^}]+)\}/,
        slice: /slice:\s*\{([^}]+)\}/,
    };
    
    for (const [unit, regex] of Object.entries(convSections)) {
        const sectionMatch = content.match(regex);
        if (sectionMatch) {
            const section = sectionMatch[1];
            const convRegex = /['"]([^'"]+)['"]:\s*\{[^}]*to100g:\s*(\d+(?:\.\d+)?)/g;
            let convMatch;
            while ((convMatch = convRegex.exec(section)) !== null) {
                conversions[unit][convMatch[1]] = parseFloat(convMatch[2]);
            }
        }
    }
    
    return { data, conversions };
}

const { data: nutritionalData, conversions: unitConversions } = loadNutritionalData();

console.log(`✅ Chargé ${Object.keys(nutritionalData).length} ingrédients`);

// Helper pour convertir en grammes
function convertToGrams(name, quantity, unit) {
    const normalized = name.toLowerCase().trim();
    
    if (unit === 'G' || unit === 'KG' || unit === 'ML' || unit === 'L') {
        if (unit === 'KG') return quantity * 1000;
        if (unit === 'L') return quantity * 1000;
        return quantity;
    }
    
    const convMap = {
        'PIECE': unitConversions.piece,
        'TBSP': unitConversions.tbsp,
        'TSP': unitConversions.tsp,
        'CLOVE': unitConversions.clove,
        'BUNCH': unitConversions.bunch,
        'SLICE': unitConversions.slice,
    };
    
    if (convMap[unit] && convMap[unit][normalized]) {
        return quantity * convMap[unit][normalized];
    }
    
    if (unit === 'PINCH') return 0;
    
    return 0;
}

// Calculer les valeurs nutritionnelles
function calculateNutrition(ingredients, servings) {
    let totalCal = 0, totalCarbs = 0, totalFats = 0, totalProteins = 0, totalFibers = 0;
    const missing = [];
    
    for (const ing of ingredients) {
        const normalized = ing.name.toLowerCase().trim();
        const nd = nutritionalData[normalized];
        
        if (!nd) {
            missing.push(ing.name);
            continue;
        }
        
        if (nd.unit === '100g' || nd.unit === '100ml') {
            const grams = convertToGrams(ing.name, ing.quantity, ing.unit);
            const factor = grams / 100;
            totalCal += nd.calories * factor;
            totalCarbs += nd.carbohydrates * factor;
            totalFats += nd.fats * factor;
            totalProteins += nd.proteins * factor;
            totalFibers += nd.fibers * factor;
        } else {
            // Per unit
            totalCal += nd.calories * ing.quantity;
            totalCarbs += nd.carbohydrates * ing.quantity;
            totalFats += nd.fats * ing.quantity;
            totalProteins += nd.proteins * ing.quantity;
            totalFibers += nd.fibers * ing.quantity;
        }
    }
    
    return {
        calories: Math.round(totalCal / servings),
        carbohydrates: Math.round((totalCarbs / servings) * 10) / 10,
        fats: Math.round((totalFats / servings) * 10) / 10,
        proteins: Math.round((totalProteins / servings) * 10) / 10,
        fibers: Math.round((totalFibers / servings) * 10) / 10,
        missing,
    };
}

// Fonction pour extraire et modifier les recettes dans un fichier
function fixFile(filePath) {
    console.log(`\n📝 Traitement de ${path.basename(filePath)}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let count = 0;
    
    // Trouver toutes les recettes dans le fichier
    // Format: { title: '...', ..., servings: X, ..., calories: Y, ..., ingredients: [...] }
    const recipeRegex = /(\{[^}]*title:\s*['"]([^'"]+)['"][^}]*servings:\s*(\d+)[^}]*calories:\s*(\d+)[^}]*carbohydrates:\s*(\d+(?:\.\d+)?)[^}]*fats:\s*(\d+(?:\.\d+)?)[^}]*proteins:\s*(\d+(?:\.\d+)?)[^}]*fibers:\s*(\d+(?:\.\d+)?)[^}]*ingredients:\s*\[([^\]]+)\][^}]*\})/gs;
    
    // Approche différente: trouver les blocs de recettes complets
    // Chercher le pattern: calories: X, puis extraire les ingrédients avant
    
    // Version simplifiée: trouver calories: X et remplacer avec les nouvelles valeurs calculées
    // Mais d'abord, il faut extraire les ingrédients de chaque recette
    
    // Meilleure approche: parser le fichier ligne par ligne pour trouver les recettes
    const lines = content.split('\n');
    let inRecipe = false;
    let currentRecipe = null;
    let recipeStart = -1;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Détecter le début d'une recette
        if (line.match(/^\s*\{/)) {
            inRecipe = true;
            recipeStart = i;
            currentRecipe = { start: i, lines: [], servings: null, ingredients: [] };
            braceCount = 1;
            continue;
        }
        
        if (inRecipe) {
            currentRecipe.lines.push(line);
            
            // Compter les accolades
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            // Extraire servings
            const servingsMatch = line.match(/servings:\s*(\d+)/);
            if (servingsMatch) {
                currentRecipe.servings = parseInt(servingsMatch[1]);
            }
            
            // Extraire ingredients
            if (line.includes('ingredients:') && line.includes('[')) {
                // Ingredient list starts
                let ingContent = line;
                let ingBraceCount = (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
                let j = i + 1;
                while (ingBraceCount > 0 && j < lines.length) {
                    ingContent += '\n' + lines[j];
                    currentRecipe.lines.push(lines[j]);
                    ingBraceCount += (lines[j].match(/\[/g) || []).length;
                    ingBraceCount -= (lines[j].match(/\]/g) || []).length;
                    j++;
                    i = j - 1;
                }
                
                // Extraire les ingrédients du contenu
                const ingRegex = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*quantity:\s*(\d+(?:\.\d+)?)\s*,\s*unit:\s*Unit\.(\w+)/g;
                let ingMatch;
                while ((ingMatch = ingRegex.exec(ingContent)) !== null) {
                    currentRecipe.ingredients.push({
                        name: ingMatch[1],
                        quantity: parseFloat(ingMatch[2]),
                        unit: ingMatch[3],
                    });
                }
            }
            
            // Fin de la recette
            if (braceCount === 0) {
                // Calculer les nouvelles valeurs
                if (currentRecipe.servings && currentRecipe.ingredients.length > 0) {
                    const calc = calculateNutrition(currentRecipe.ingredients, currentRecipe.servings);
                    
                    // Trouver et remplacer les valeurs nutritionnelles dans cette recette
                    const recipeBlock = currentRecipe.lines.join('\n');
                    const newBlock = recipeBlock
                        .replace(/calories:\s*\d+/, `calories: ${calc.calories}`)
                        .replace(/carbohydrates:\s*\d+(?:\.\d+)?/, `carbohydrates: ${calc.carbohydrates}`)
                        .replace(/fats:\s*\d+(?:\.\d+)?/, `fats: ${calc.fats}`)
                        .replace(/proteins:\s*\d+(?:\.\d+)?/, `proteins: ${calc.proteins}`)
                        .replace(/fibers:\s*\d+(?:\.\d+)?/, `fibers: ${calc.fibers}`);
                    
                    if (newBlock !== recipeBlock) {
                        // Remplacer dans content
                        const oldStart = lines.slice(recipeStart, currentRecipe.start + currentRecipe.lines.length).join('\n');
                        content = content.replace(oldStart, newBlock);
                        modified = true;
                        count++;
                        
                        if (calc.missing.length > 0) {
                            console.log(`  ⚠️  ${currentRecipe.ingredients[0]?.name || 'Recette'} - Manquants: ${calc.missing.join(', ')}`);
                        }
                    }
                }
                
                inRecipe = false;
                currentRecipe = null;
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ ${count} recettes corrigées`);
    } else {
        console.log(`  ℹ️  Aucune modification`);
    }
    
    return { modified, count };
}

// Corriger tous les fichiers
const files = [
    path.join(__dirname, 'seed-recipes-more.ts'),
    path.join(__dirname, 'seed-recipes-extended.ts'),
    // seed.ts est plus complexe car les recettes sont créées différemment
];

let totalFixed = 0;
for (const file of files) {
    if (fs.existsSync(file)) {
        const result = fixFile(file);
        totalFixed += result.count;
    }
}

console.log(`\n✅ Total: ${totalFixed} recettes corrigées`);
console.log('\n🗑️  Suppression du script...');
fs.unlinkSync(__filename);
console.log('✅ Script supprimé');

