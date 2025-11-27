/**
 * Fonction utilitaire pour calculer les valeurs nutritionnelles
 * d'une recette à partir de ses ingrédients
 */

import { nutritionalData, unitConversions } from '../../prisma/nutritional-data';
import { Unit } from '@prisma/client';

export interface NutritionalValues {
    calories: number;
    carbohydrates: number;
    fats: number;
    proteins: number;
    fibers: number;
}

interface IngredientInput {
    name: string;
    quantity: number;
    unit: Unit;
}

/**
 * Convertit une quantité en grammes selon l'unité
 */
function convertToGrams(ingredientName: string, quantity: number, unit: Unit): number {
    const normalizedName = ingredientName.toLowerCase().trim();

    // Unités de poids/volume simples
    if (unit === Unit.G) return quantity;
    if (unit === Unit.KG) return quantity * 1000;
    if (unit === Unit.ML || unit === Unit.L) {
        return unit === Unit.L ? quantity * 1000 : quantity;
    }

    // Conversions d'unités spéciales
    let conversionMap: Record<string, { to100g: number }> | undefined;
    
    switch (unit) {
        case Unit.PIECE:
            conversionMap = unitConversions['piece'] as Record<string, { to100g: number }>;
            break;
        case Unit.TBSP:
            conversionMap = unitConversions['tbsp'] as Record<string, { to100g: number }>;
            break;
        case Unit.TSP:
            conversionMap = unitConversions['tsp'] as Record<string, { to100g: number }>;
            break;
        case Unit.CLOVE:
            conversionMap = unitConversions['clove'] as Record<string, { to100g: number }>;
            break;
        case Unit.BUNCH:
            conversionMap = unitConversions['bunch'] as Record<string, { to100g: number }>;
            break;
        case Unit.SLICE:
            conversionMap = unitConversions['slice'] as Record<string, { to100g: number }>;
            break;
    }

    if (conversionMap && conversionMap[normalizedName]) {
        return quantity * conversionMap[normalizedName].to100g;
    }

    // PINCH et autres unités négligeables
    if (unit === Unit.PINCH) return 0;

    return 0;
}

/**
 * Calcule les valeurs nutritionnelles d'une recette à partir de ses ingrédients
 * @param ingredients Liste des ingrédients avec quantité et unité
 * @param servings Nombre de portions
 * @returns Valeurs nutritionnelles par portion
 */
export function calculateNutritionalValues(
    ingredients: IngredientInput[],
    servings: number
): NutritionalValues {
    let totalCalories = 0;
    let totalCarbohydrates = 0;
    let totalFats = 0;
    let totalProteins = 0;
    let totalFibers = 0;

    for (const ing of ingredients) {
        const normalizedName = ing.name.toLowerCase().trim();
        const data = nutritionalData[normalizedName];

        if (!data) {
            // Ingredient non trouvé dans la base de données nutritionnelle
            continue;
        }

        if (data.unit === '100g' || data.unit === '100ml') {
            // Les données sont par 100g/ml
            const quantityInGrams = convertToGrams(ing.name, ing.quantity, ing.unit);
            const factor = quantityInGrams / 100;

            totalCalories += data.calories * factor;
            totalCarbohydrates += data.carbohydrates * factor;
            totalFats += data.fats * factor;
            totalProteins += data.proteins * factor;
            totalFibers += data.fibers * factor;
        } else {
            // Les données sont par unité (piece, tbsp, tsp, etc.)
            totalCalories += data.calories * ing.quantity;
            totalCarbohydrates += data.carbohydrates * ing.quantity;
            totalFats += data.fats * ing.quantity;
            totalProteins += data.proteins * ing.quantity;
            totalFibers += data.fibers * ing.quantity;
        }
    }

    // Retourner les valeurs par portion
    // IMPORTANT: Les quantités d'ingrédients sont pour 'servings' portions
    // On divise donc par 'servings' pour obtenir les valeurs par portion
    
    if (!servings || servings <= 0 || isNaN(servings)) {
        console.warn(`[nutrition-calculator] servings invalide: ${servings}, utilisation de 1`);
        servings = 1;
    }
    
    // S'assurer que servings est un nombre
    const servingsNum = Number(servings);
    if (isNaN(servingsNum) || servingsNum <= 0) {
        console.error(`[nutrition-calculator] servings n'est pas un nombre valide: ${servings}`);
        servings = 1;
    } else {
        servings = servingsNum;
    }
    
    const caloriesPerServing = totalCalories / servings;
    const carbohydratesPerServing = totalCarbohydrates / servings;
    const fatsPerServing = totalFats / servings;
    const proteinsPerServing = totalProteins / servings;
    const fibersPerServing = totalFibers / servings;
    
    console.log(`[nutrition-calculator] Total: ${totalCalories.toFixed(2)} kcal, Servings: ${servings}, Par portion: ${caloriesPerServing.toFixed(2)} kcal`);
    
    return {
        calories: Math.round(caloriesPerServing),
        carbohydrates: Math.round(carbohydratesPerServing * 10) / 10,
        fats: Math.round(fatsPerServing * 10) / 10,
        proteins: Math.round(proteinsPerServing * 10) / 10,
        fibers: Math.round(fibersPerServing * 10) / 10,
    };
}

