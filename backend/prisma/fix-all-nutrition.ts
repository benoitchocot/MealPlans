/**
 * Script TypeScript pour corriger toutes les valeurs nutritionnelles
 * Utilise directement les imports et modifie les fichiers
 */

import * as fs from 'fs';
import * as path from 'path';
import { nutritionalData } from './nutritional-data';
import { moreRecipes } from './seed-recipes-more';
import { extendedRecipes } from './seed-recipes-extended';
import { Unit } from '@prisma/client';

// Conversions d'unités simplifiées
const unitConversions: Record<string, Record<string, number>> = {
    [Unit.PIECE]: {
        'tomate': 150,
        'oignon': 100,
        'carotte': 100,
        'courgette': 200,
        'aubergine': 300,
        'poivron': 150,
        'tortillas': 40,
        'citron vert': 50,
        'citron': 100,
        'pomme': 150,
        'banane': 120,
        'oeuf': 50,
        'saucisse': 100,
        'merguez': 50,
        'avocat': 150,
    },
    [Unit.TBSP]: {
        'huile d\'olive': 15,
        'huile végétale': 15,
        'sauce soja': 15,
    },
    [Unit.TSP]: {
        'cumin': 2,
        'paprika': 2,
        'curry': 2,
    },
    [Unit.BUNCH]: {
        'salade': 50,
        'coriandre': 30,
        'persil': 20,
        'basilic': 30,
    },
};

function convertToGrams(name: string, quantity: number, unit: string): number {
    if (unit === Unit.G) return quantity;
    if (unit === Unit.KG) return quantity * 1000;
    if (unit === Unit.ML || unit === Unit.L) {
        return unit === Unit.L ? quantity * 1000 : quantity;
    }
    
    const normalized = name.toLowerCase().trim();
    if (unitConversions[unit] && unitConversions[unit][normalized]) {
        return quantity * unitConversions[unit][normalized];
    }
    
    return 0;
}

function calculateNutrition(
    ingredients: Array<{ name: string; quantity: number; unit: string }>,
    servings: number
): { calories: number; carbohydrates: number; fats: number; proteins: number; fibers: number } {
    let totalCal = 0, totalCarbs = 0, totalFats = 0, totalProteins = 0, totalFibers = 0;
    
    for (const ing of ingredients) {
        const normalized = ing.name.toLowerCase().trim();
        const data = nutritionalData[normalized];
        
        if (!data) continue;
        
        if (data.unit === '100g' || data.unit === '100ml') {
            const grams = convertToGrams(ing.name, ing.quantity, ing.unit);
            const factor = grams / 100;
            totalCal += data.calories * factor;
            totalCarbs += data.carbohydrates * factor;
            totalFats += data.fats * factor;
            totalProteins += data.proteins * factor;
            totalFibers += data.fibers * factor;
        } else {
            totalCal += data.calories * ing.quantity;
            totalCarbs += data.carbohydrates * ing.quantity;
            totalFats += data.fats * ing.quantity;
            totalProteins += data.proteins * ing.quantity;
            totalFibers += data.fibers * ing.quantity;
        }
    }
    
    return {
        calories: Math.round(totalCal / servings),
        carbohydrates: Math.round((totalCarbs / servings) * 10) / 10,
        fats: Math.round((totalFats / servings) * 10) / 10,
        proteins: Math.round((totalProteins / servings) * 10) / 10,
        fibers: Math.round((totalFibers / servings) * 10) / 10,
    };
}

// Fonction pour mettre à jour un fichier
function updateFile(filePath: string, recipes: any[], recipesArrayName: string) {
    console.log(`\n📝 Correction de ${path.basename(filePath)}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = 0;
    
    for (const recipe of recipes) {
        if (!recipe.ingredients || recipe.ingredients.length === 0) continue;
        if (!recipe.servings) continue;
        
        const calc = calculateNutrition(
            recipe.ingredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
            })),
            recipe.servings
        );
        
        // Trouver et remplacer les valeurs dans le fichier
        const titlePattern = recipe.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const slugPattern = recipe.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Pattern pour trouver la recette complète
        const recipePattern = new RegExp(
            `(title:\\s*['"]${titlePattern}['"][\\s\\S]*?calories:\\s*)(\\d+)` +
            `([\\s\\S]*?carbohydrates:\\s*)(\\d+(?:\\.\\d+)?)` +
            `([\\s\\S]*?fats:\\s*)(\\d+(?:\\.\\d+)?)` +
            `([\\s\\S]*?proteins:\\s*)(\\d+(?:\\.\\d+)?)` +
            `([\\s\\S]*?fibers:\\s*)(\\d+(?:\\.\\d+)?)`,
            'm'
        );
        
        const match = content.match(recipePattern);
        if (match) {
            const newContent = content.replace(
                recipePattern,
                `$1${calc.calories}$3${calc.carbohydrates}$5${calc.fats}$7${calc.proteins}$9${calc.fibers}`
            );
            
            if (newContent !== content) {
                content = newContent;
                updated++;
                console.log(`  ✅ ${recipe.title}: ${recipe.calories || '?'} → ${calc.calories} kcal`);
            }
        } else {
            // Essayer une approche plus simple : remplacer ligne par ligne
            const lines = content.split('\n');
            let inRecipe = false;
            let recipeStart = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(`title: '${recipe.title}'`) || lines[i].includes(`title: "${recipe.title}"`)) {
                    inRecipe = true;
                    recipeStart = i;
                }
                
                if (inRecipe) {
                    // Trouver calories
                    if (lines[i].match(/^\s*calories:\s*\d+/)) {
                        lines[i] = lines[i].replace(/calories:\s*\d+/, `calories: ${calc.calories}`);
                    }
                    if (lines[i].match(/^\s*carbohydrates:\s*\d+/)) {
                        lines[i] = lines[i].replace(/carbohydrates:\s*\d+(?:\.\d+)?/, `carbohydrates: ${calc.carbohydrates}`);
                    }
                    if (lines[i].match(/^\s*fats:\s*\d+/)) {
                        lines[i] = lines[i].replace(/fats:\s*\d+(?:\\.d+)?/, `fats: ${calc.fats}`);
                    }
                    if (lines[i].match(/^\s*proteins:\s*\d+/)) {
                        lines[i] = lines[i].replace(/proteins:\s*\d+(?:\.\d+)?/, `proteins: ${calc.proteins}`);
                    }
                    if (lines[i].match(/^\s*fibers:\s*\d+/)) {
                        lines[i] = lines[i].replace(/fibers:\s*\d+(?:\.\d+)?/, `fibers: ${calc.fibers}`);
                    }
                    
                    // Fin de la recette (prochaine recette ou fin du tableau)
                    if (i > recipeStart && (lines[i].match(/^\s*\{/) || lines[i].match(/^\s*\],?\s*$/))) {
                        break;
                    }
                }
            }
            
            const newContent = lines.join('\n');
            if (newContent !== content) {
                content = newContent;
                updated++;
                console.log(`  ✅ ${recipe.title}: ${recipe.calories || '?'} → ${calc.calories} kcal`);
            }
        }
    }
    
    if (updated > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ ${updated} recettes mises à jour`);
    }
    
    return updated;
}

// Corriger les fichiers
let total = 0;
total += updateFile(path.join(__dirname, 'seed-recipes-more.ts'), moreRecipes, 'moreRecipes');
total += updateFile(path.join(__dirname, 'seed-recipes-extended.ts'), extendedRecipes, 'extendedRecipes');

console.log(`\n✅ Total: ${total} recettes corrigées`);
console.log('\n🗑️  Suppression du script...');
fs.unlinkSync(__filename);
console.log('✅ Terminé !');

