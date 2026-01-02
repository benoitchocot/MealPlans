// Base de données nutritionnelle des ingrédients
// Valeurs pour 100g (ou par unité pour les pièces)
// Sources : Ciqual, USDA FoodData Central

export const nutritionalData: Record<string, {
    calories: number; // kcal per 100g (or per unit)
    carbohydrates: number; // g per 100g (or per unit)
    fats: number; // g per 100g (or per unit)
    proteins: number; // g per 100g (or per unit)
    fibers: number; // g per 100g (or per unit)
    unit: '100g' | 'piece' | 'tbsp' | 'tsp' | 'ml' | 'clove' | 'bunch' | 'slice' | 'pinch' | '100ml';
}> = {
    // === VIANDES ===
    'boeuf haché': { calories: 240, carbohydrates: 0, fats: 15, proteins: 26, fibers: 0, unit: '100g' },
    'boeuf': { calories: 250, carbohydrates: 0, fats: 16, proteins: 26, fibers: 0, unit: '100g' },
    'poulet': { calories: 165, carbohydrates: 0, fats: 3.6, proteins: 31, fibers: 0, unit: '100g' },
    'lardons': { calories: 345, carbohydrates: 0, fats: 30, proteins: 17, fibers: 0, unit: '100g' },
    'saucisse': { calories: 300, carbohydrates: 2, fats: 25, proteins: 13, fibers: 0, unit: 'piece' },
    'jambon': { calories: 120, carbohydrates: 1.5, fats: 3, proteins: 20, fibers: 0, unit: 'slice' },
    'bacon': { calories: 540, carbohydrates: 1.5, fats: 42, proteins: 37, fibers: 0, unit: 'slice' },
    'agneau haché': { calories: 294, carbohydrates: 0, fats: 21, proteins: 25, fibers: 0, unit: '100g' },
    'merguez': { calories: 295, carbohydrates: 2, fats: 23, proteins: 18, fibers: 0, unit: 'piece' },
    
    // === POISSONS ===
    'saumon': { calories: 208, carbohydrates: 0, fats: 12, proteins: 25, fibers: 0, unit: '100g' },
    'thon': { calories: 144, carbohydrates: 0, fats: 1, proteins: 30, fibers: 0, unit: '100g' },
    'cabillaud': { calories: 82, carbohydrates: 0, fats: 0.7, proteins: 18, fibers: 0, unit: '100g' },
    'bar': { calories: 124, carbohydrates: 0, fats: 4, proteins: 20, fibers: 0, unit: '100g' },
    'crevettes': { calories: 99, carbohydrates: 0.9, fats: 0.3, proteins: 24, fibers: 0, unit: '100g' },
    'moules': { calories: 86, carbohydrates: 3.7, fats: 2.2, proteins: 12, fibers: 0, unit: '100g' },
    'poisson blanc': { calories: 82, carbohydrates: 0, fats: 0.7, proteins: 18, fibers: 0, unit: '100g' },
    
    // === LÉGUMES ===
    'tomate': { calories: 18, carbohydrates: 3.9, fats: 0.2, proteins: 0.9, fibers: 1.2, unit: 'piece' },
    'tomate concassée': { calories: 24, carbohydrates: 4.8, fats: 0.2, proteins: 1.1, fibers: 1.5, unit: '100g' },
    'tomate cerise': { calories: 18, carbohydrates: 3.9, fats: 0.2, proteins: 0.9, fibers: 1.2, unit: '100g' },
    'oignon': { calories: 40, carbohydrates: 9.3, fats: 0.1, proteins: 1.1, fibers: 1.7, unit: 'piece' },
    'ail': { calories: 149, carbohydrates: 33, fats: 0.5, proteins: 6.4, fibers: 2.1, unit: 'clove' },
    'carotte': { calories: 41, carbohydrates: 9.6, fats: 0.2, proteins: 0.9, fibers: 2.8, unit: 'piece' },
    'courgette': { calories: 17, carbohydrates: 3.1, fats: 0.2, proteins: 1.2, fibers: 1, unit: 'piece' },
    'aubergine': { calories: 25, carbohydrates: 5.9, fats: 0.2, proteins: 1, fibers: 3, unit: 'piece' },
    'poivron': { calories: 20, carbohydrates: 4.6, fats: 0.2, proteins: 0.9, fibers: 1.5, unit: 'piece' },
    'champignon': { calories: 22, carbohydrates: 3.3, fats: 0.3, proteins: 3.1, fibers: 1, unit: '100g' },
    'brocoli': { calories: 34, carbohydrates: 7, fats: 0.4, proteins: 2.8, fibers: 2.6, unit: '100g' },
    'épinard': { calories: 23, carbohydrates: 3.6, fats: 0.4, proteins: 2.9, fibers: 2.2, unit: '100g' },
    'pomme de terre': { calories: 77, carbohydrates: 17, fats: 0.1, proteins: 2, fibers: 2.2, unit: 'piece' },
    'patate douce': { calories: 86, carbohydrates: 20, fats: 0.1, proteins: 1.6, fibers: 3, unit: '100g' },
    'salade': { calories: 15, carbohydrates: 2.9, fats: 0.2, proteins: 1.4, fibers: 1.3, unit: '100g' },
    'navet': { calories: 28, carbohydrates: 6.4, fats: 0.1, proteins: 0.9, fibers: 1.8, unit: 'piece' },
    'fenouil': { calories: 31, carbohydrates: 7.3, fats: 0.2, proteins: 1.2, fibers: 3.1, unit: 'piece' },
    'petits pois': { calories: 81, carbohydrates: 14, fats: 0.4, proteins: 5.4, fibers: 5.1, unit: '100g' },
    'haricots verts': { calories: 31, carbohydrates: 7, fats: 0.1, proteins: 1.8, fibers: 2.4, unit: '100g' },
    'concombre': { calories: 16, carbohydrates: 4, fats: 0.1, proteins: 0.7, fibers: 0.5, unit: 'piece' },
    'courge': { calories: 20, carbohydrates: 5, fats: 0.1, proteins: 0.6, fibers: 1.5, unit: 'piece' },
    'potiron': { calories: 26, carbohydrates: 6.5, fats: 0.1, proteins: 1, fibers: 0.5, unit: '100g' },
    'butternut': { calories: 45, carbohydrates: 12, fats: 0.1, proteins: 1, fibers: 2, unit: '100g' },
    'asperge': { calories: 20, carbohydrates: 3.9, fats: 0.1, proteins: 2.2, fibers: 2.1, unit: 'piece' },
    'avocat': { calories: 160, carbohydrates: 9, fats: 15, proteins: 2, fibers: 7, unit: 'piece' },
    'maïs': { calories: 365, carbohydrates: 74, fats: 4.7, proteins: 9.4, fibers: 7.3, unit: '100g' },
    
    // === LÉGUMINEUSES ===
    'haricots rouges': { calories: 337, carbohydrates: 60, fats: 0.8, proteins: 22, fibers: 16, unit: '100g' },
    'haricots noirs': { calories: 341, carbohydrates: 62, fats: 1.4, proteins: 21, fibers: 15, unit: '100g' },
    'pois chiches': { calories: 364, carbohydrates: 61, fats: 6, proteins: 19, fibers: 17, unit: '100g' },
    'lentilles': { calories: 353, carbohydrates: 63, fats: 2.2, proteins: 25, fibers: 11, unit: '100g' },
    'lentilles corail': { calories: 358, carbohydrates: 64, fats: 2.2, proteins: 24, fibers: 10, unit: '100g' },
    'quinoa': { calories: 368, carbohydrates: 64, fats: 6, proteins: 14, fibers: 7, unit: '100g' },
    
    // === FÉCULENTS ===
    'pâtes': { calories: 371, carbohydrates: 75, fats: 1.5, proteins: 13, fibers: 3, unit: '100g' },
    'riz': { calories: 365, carbohydrates: 80, fats: 0.7, proteins: 7.1, fibers: 1.3, unit: '100g' },
    'nouilles de riz': { calories: 365, carbohydrates: 80, fats: 0.7, proteins: 7.1, fibers: 1.3, unit: '100g' },
    'nouilles soba': { calories: 99, carbohydrates: 21, fats: 0.1, proteins: 5, fibers: 0, unit: '100g' },
    'semoule': { calories: 368, carbohydrates: 73, fats: 1.1, proteins: 12, fibers: 2.5, unit: '100g' },
    'macaroni': { calories: 371, carbohydrates: 75, fats: 1.5, proteins: 13, fibers: 3, unit: '100g' },
    'pain': { calories: 265, carbohydrates: 49, fats: 3.2, proteins: 9, fibers: 2.7, unit: 'slice' },
    
    // === PRODUITS LAITIERS ===
    'lait': { calories: 42, carbohydrates: 5, fats: 1, proteins: 3.4, fibers: 0, unit: '100ml' },
    'crème fraîche': { calories: 292, carbohydrates: 3, fats: 30, proteins: 2.5, fibers: 0, unit: '100ml' },
    'beurre': { calories: 717, carbohydrates: 0.1, fats: 81, proteins: 0.9, fibers: 0, unit: '100g' },
    'fromage râpé': { calories: 363, carbohydrates: 1, fats: 27, proteins: 25, fibers: 0, unit: '100g' },
    'fromage cheddar': { calories: 402, carbohydrates: 1.3, fats: 33, proteins: 25, fibers: 0, unit: '100g' },
    'parmesan': { calories: 431, carbohydrates: 4.1, fats: 29, proteins: 38, fibers: 0, unit: '100g' },
    'mozzarella': { calories: 300, carbohydrates: 2.2, fats: 22, proteins: 22, fibers: 0, unit: '100g' },
    'fromage de chèvre sec': { calories: 364, carbohydrates: 2.5, fats: 30, proteins: 19, fibers: 0, unit: '100g' },
    'fromage blanc': { calories: 47, carbohydrates: 3.6, fats: 0.2, proteins: 7.6, fibers: 0, unit: '100g' }, // Corrigé: 4*3.6 + 9*0.2 + 4*7.6 = 46.6
    'mascarpone': { calories: 429, carbohydrates: 4.6, fats: 44, proteins: 4.6, fibers: 0, unit: '100g' },
    'yaourt': { calories: 59, carbohydrates: 4.7, fats: 3.3, proteins: 3.5, fibers: 0, unit: '100g' },
    'oeuf': { calories: 155, carbohydrates: 1.1, fats: 11, proteins: 13, fibers: 0, unit: 'piece' },
    
    // === HUILES & MATIÈRES GRASSES ===
    'huile d\'olive': { calories: 884, carbohydrates: 0, fats: 100, proteins: 0, fibers: 0, unit: '100g' }, // 884 kcal pour 100g, 1 TBSP = 15g = 133 kcal
    'huile végétale': { calories: 884, carbohydrates: 0, fats: 100, proteins: 0, fibers: 0, unit: '100g' },
    'huile de coco': { calories: 862, carbohydrates: 0, fats: 100, proteins: 0, fibers: 0, unit: '100ml' },
    
    // === ÉPICES & AROMATES ===
    // Note: Les épices sont utilisées en très petites quantités, les valeurs sont pour 100g mais l'unité est tsp
    // Les fibres des épices sont souvent non digestibles, donc comptées à 0 kcal dans certains systèmes
    'cumin': { calories: 375, carbohydrates: 44, fats: 22, proteins: 18, fibers: 10, unit: 'tsp' }, // ~2g = 7.5 kcal
    'paprika': { calories: 282, carbohydrates: 54, fats: 13, proteins: 14, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'curry': { calories: 325, carbohydrates: 56, fats: 14, proteins: 14, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'thym': { calories: 276, carbohydrates: 63, fats: 7, proteins: 9, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'persil': { calories: 36, carbohydrates: 6, fats: 0.8, proteins: 3, fibers: 3.3, unit: 'bunch' },
    'basilic': { calories: 22, carbohydrates: 2.6, fats: 0.6, proteins: 3.2, fibers: 1.6, unit: 'bunch' },
    'coriandre': { calories: 23, carbohydrates: 3.7, fats: 0.5, proteins: 2.1, fibers: 2.8, unit: 'bunch' },
    'gingembre': { calories: 80, carbohydrates: 18, fats: 0.8, proteins: 1.8, fibers: 2, unit: '100g' },
    'piment': { calories: 40, carbohydrates: 9, fats: 0.4, proteins: 1.9, fibers: 1.5, unit: 'piece' },
    'cannelle': { calories: 247, carbohydrates: 81, fats: 1.2, proteins: 4, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'sel': { calories: 0, carbohydrates: 0, fats: 0, proteins: 0, fibers: 0, unit: 'pinch' },
    'poivre': { calories: 251, carbohydrates: 64, fats: 3.3, proteins: 10, fibers: 0, unit: 'pinch' }, // Fibres non digestibles
    
    // === AUTRES ===
    'sucre': { calories: 387, carbohydrates: 100, fats: 0, proteins: 0, fibers: 0, unit: '100g' },
    'farine': { calories: 364, carbohydrates: 76, fats: 1, proteins: 10, fibers: 2.7, unit: '100g' },
    'bouillon de légumes': { calories: 5, carbohydrates: 0.5, fats: 0.1, proteins: 0.2, fibers: 0, unit: '100ml' },
    'bouillon de poulet': { calories: 15, carbohydrates: 1, fats: 0.5, proteins: 1, fibers: 0, unit: '100ml' },
    'bouillon de poisson': { calories: 10, carbohydrates: 0.3, fats: 0.2, proteins: 1.5, fibers: 0, unit: '100ml' },
    // Note: L'alcool contient 7 kcal/g mais n'est pas compté dans les macros (carbs/fats/proteins)
    // Le vin contient ~10-13% d'alcool, donc ~70-90 kcal viennent de l'alcool
    'vin rouge': { calories: 83, carbohydrates: 2.6, fats: 0, proteins: 0.1, fibers: 0, unit: '100ml' }, // Alcool: ~70 kcal non compté dans macros
    'vin blanc': { calories: 82, carbohydrates: 2.6, fats: 0, proteins: 0.1, fibers: 0, unit: '100ml' }, // Alcool: ~70 kcal non compté dans macros
    'lait de coco': { calories: 230, carbohydrates: 6, fats: 24, proteins: 2.3, fibers: 2.2, unit: '100ml' },
    'sauce soja': { calories: 53, carbohydrates: 4.9, fats: 0.1, proteins: 8.1, fibers: 0.8, unit: 'tbsp' },
    'moutarde': { calories: 66, carbohydrates: 5.8, fats: 3.7, proteins: 3.7, fibers: 3.2, unit: 'tsp' },
    'vinaigre': { calories: 18, carbohydrates: 0.9, fats: 0, proteins: 0, fibers: 0, unit: 'tbsp' },
    'citron': { calories: 29, carbohydrates: 9, fats: 0.3, proteins: 1.1, fibers: 2.8, unit: 'piece' },
    'citron vert': { calories: 30, carbohydrates: 10.5, fats: 0.2, proteins: 0.7, fibers: 2.8, unit: 'piece' },
    'olives': { calories: 115, carbohydrates: 6, fats: 10.7, proteins: 0.8, fibers: 3.2, unit: '100g' },
    'citron confit': { calories: 29, carbohydrates: 9, fats: 0.3, proteins: 1.1, fibers: 2.8, unit: 'piece' },
    'pâte brisée': { calories: 380, carbohydrates: 46, fats: 20, proteins: 5, fibers: 1.5, unit: 'piece' },
    'biscuits à la cuillère': { calories: 423, carbohydrates: 72, fats: 11, proteins: 8.5, fibers: 2.1, unit: 'piece' },
    'chocolat noir': { calories: 546, carbohydrates: 46, fats: 31, proteins: 4.9, fibers: 11, unit: '100g' },
    'cacao': { calories: 228, carbohydrates: 58, fats: 13.7, proteins: 19.6, fibers: 0, unit: '100g' }, // Fibres non digestibles (cacao en poudre)
    'miel': { calories: 304, carbohydrates: 82, fats: 0, proteins: 0.3, fibers: 0.2, unit: '100ml' },
    'vanille': { calories: 13, carbohydrates: 13, fats: 0.1, proteins: 0.1, fibers: 0, unit: 'piece' }, // 1 gousse ≈ 5g, corrigé
    'fraise': { calories: 32, carbohydrates: 7.7, fats: 0.3, proteins: 0.7, fibers: 2, unit: '100g' },
    'framboise': { calories: 52, carbohydrates: 12, fats: 0.7, proteins: 1.2, fibers: 6.5, unit: '100g' },
    'myrtille': { calories: 57, carbohydrates: 14.5, fats: 0.3, proteins: 0.7, fibers: 2.4, unit: '100g' },
    'tofu': { calories: 76, carbohydrates: 1.9, fats: 4.8, proteins: 8, fibers: 0.3, unit: '100g' },
    'pousses de soja': { calories: 30, carbohydrates: 5.9, fats: 0.2, proteins: 3, fibers: 1.8, unit: '100g' },
    'noix de coco râpée': { calories: 660, carbohydrates: 24, fats: 65, proteins: 6.9, fibers: 16, unit: '100g' },
    'raisin sec': { calories: 299, carbohydrates: 79, fats: 0.5, proteins: 3.1, fibers: 3.7, unit: '100g' },
    'granola': { calories: 471, carbohydrates: 66, fats: 20, proteins: 10, fibers: 7.5, unit: '100g' },
    'flocons d\'avoine': { calories: 389, carbohydrates: 66, fats: 6.9, proteins: 17, fibers: 11, unit: '100g' },
    'algue nori': { calories: 35, carbohydrates: 5.1, fats: 0.3, proteins: 5.8, fibers: 0, unit: 'piece' },
    'wasabi': { calories: 109, carbohydrates: 24, fats: 0.6, proteins: 4.8, fibers: 7.8, unit: '100g' },
    'gingembre confit': { calories: 80, carbohydrates: 18, fats: 0.8, proteins: 1.8, fibers: 2, unit: '100g' },
    'muffin anglais': { calories: 131, carbohydrates: 26, fats: 1, proteins: 4.4, fibers: 1.6, unit: 'piece' },
    
    // === INGRÉDIENTS MANQUANTS ===
    'pomme': { calories: 52, carbohydrates: 14, fats: 0.2, proteins: 0.3, fibers: 2.4, unit: 'piece' },
    'chou': { calories: 25, carbohydrates: 5.8, fats: 0.1, proteins: 1.3, fibers: 2.5, unit: '100g' },
    'cacahuète': { calories: 567, carbohydrates: 16, fats: 49, proteins: 26, fibers: 8.5, unit: '100g' },
    'tortillas': { calories: 237, carbohydrates: 49, fats: 2.8, proteins: 7.8, fibers: 2.1, unit: 'piece' },
    'pâte de curry': { calories: 200, carbohydrates: 30, fats: 8, proteins: 5, fibers: 5, unit: 'tbsp' },
    'nuoc mam': { calories: 35, carbohydrates: 3.5, fats: 0, proteins: 5.5, fibers: 0, unit: 'tbsp' },
    'vinaigre de riz': { calories: 18, carbohydrates: 0.9, fats: 0, proteins: 0, fibers: 0, unit: 'tbsp' },
    'safran': { calories: 310, carbohydrates: 65, fats: 6, proteins: 11, fibers: 3.9, unit: 'tsp' },
    'banane': { calories: 89, carbohydrates: 23, fats: 0.3, proteins: 1.1, fibers: 2.6, unit: 'piece' },
    'noix': { calories: 654, carbohydrates: 14, fats: 65, proteins: 15, fibers: 6.7, unit: '100g' },
    'mayonnaise': { calories: 680, carbohydrates: 0.6, fats: 75, proteins: 1, fibers: 0, unit: 'tbsp' },
    'pâte feuilletée': { calories: 558, carbohydrates: 45, fats: 38, proteins: 7.5, fibers: 1.5, unit: 'piece' },
    'levure': { calories: 105, carbohydrates: 18, fats: 1.9, proteins: 12, fibers: 8, unit: '100g' },
    'sucre glace': { calories: 389, carbohydrates: 100, fats: 0, proteins: 0, fibers: 0, unit: '100g' },
    'noix de muscade': { calories: 525, carbohydrates: 49, fats: 36, proteins: 6, fibers: 21, unit: 'tsp' },
    'ciboulette': { calories: 30, carbohydrates: 4.4, fats: 0.7, proteins: 3.3, fibers: 2.5, unit: 'bunch' },
    'coriandre en poudre': { calories: 298, carbohydrates: 55, fats: 10, proteins: 21, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'bouillon': { calories: 10, carbohydrates: 0.3, fats: 0.2, proteins: 1.5, fibers: 0, unit: '100ml' },
    'huile de sésame': { calories: 884, carbohydrates: 0, fats: 100, proteins: 0, fibers: 0, unit: 'tsp' },
    'aneth': { calories: 43, carbohydrates: 7, fats: 1.1, proteins: 3.5, fibers: 2.1, unit: 'bunch' },
    'herbes de provence': { calories: 250, carbohydrates: 45, fats: 8, proteins: 12, fibers: 0, unit: 'tsp' }, // Fibres non digestibles
    'laurier': { calories: 313, carbohydrates: 75, fats: 8.4, proteins: 7.6, fibers: 0, unit: 'piece' }, // Fibres non digestibles
    'amandes': { calories: 579, carbohydrates: 22, fats: 50, proteins: 21, fibers: 12, unit: '100g' },
    'jaune d\'oeuf': { calories: 322, carbohydrates: 3.6, fats: 27, proteins: 16, fibers: 0, unit: 'piece' },
    'sucre pour caraméliser': { calories: 387, carbohydrates: 100, fats: 0, proteins: 0, fibers: 0, unit: '100g' },
};

// Conversions pour les unités
export const unitConversions: Record<string, Record<string, { to100g: number }>> = {
    'piece': {
        // Approximations pour les pièces
        'tomate': { to100g: 150 }, // 1 tomate ≈ 150g
        'oignon': { to100g: 100 }, // 1 oignon ≈ 100g
        'carotte': { to100g: 100 }, // 1 carotte ≈ 100g
        'courgette': { to100g: 200 }, // 1 courgette ≈ 200g
        'aubergine': { to100g: 300 }, // 1 aubergine ≈ 300g
        'poivron': { to100g: 150 }, // 1 poivron ≈ 150g
        'pomme de terre': { to100g: 150 }, // 1 pomme de terre ≈ 150g
        'navet': { to100g: 100 }, // 1 navet ≈ 100g
        'fenouil': { to100g: 200 }, // 1 fenouil ≈ 200g
        'concombre': { to100g: 300 }, // 1 concombre ≈ 300g
        'courge': { to100g: 1000 }, // 1 courge ≈ 1kg
        'avocat': { to100g: 150 }, // 1 avocat ≈ 150g
        'asperge': { to100g: 20 }, // 1 asperge ≈ 20g
        'citron': { to100g: 100 }, // 1 citron ≈ 100g
        'citron vert': { to100g: 50 }, // 1 citron vert ≈ 50g
        'citron confit': { to100g: 50 }, // 1 citron confit ≈ 50g
        'piment': { to100g: 30 }, // 1 piment ≈ 30g
        'pâte brisée': { to100g: 250 }, // 1 pâte brisée ≈ 250g
        'biscuits à la cuillère': { to100g: 5 }, // 1 biscuit ≈ 5g
        'vanille': { to100g: 5 }, // 1 gousse vanille ≈ 5g
        'muffin anglais': { to100g: 57 }, // 1 muffin ≈ 57g
        'saucisse': { to100g: 100 }, // 1 saucisse ≈ 100g
        'merguez': { to100g: 50 }, // 1 merguez ≈ 50g
        'oeuf': { to100g: 50 }, // 1 oeuf ≈ 50g
        'pomme': { to100g: 150 }, // 1 pomme ≈ 150g
        'banane': { to100g: 120 }, // 1 banane ≈ 120g
        'jaune d\'oeuf': { to100g: 18 }, // 1 jaune d'oeuf ≈ 18g
        'tortillas': { to100g: 40 }, // 1 tortilla ≈ 40g
        'laurier': { to100g: 0.5 }, // 1 feuille de laurier ≈ 0.5g
    },
    'tbsp': {
        'huile d\'olive': { to100g: 15 }, // 1 c.à.s. ≈ 15ml ≈ 15g (pour l'huile)
        'huile végétale': { to100g: 15 },
        'vinaigre': { to100g: 15 }, // 1 c.à.s. ≈ 15ml
        'sauce soja': { to100g: 15 }, // 1 c.à.s. ≈ 15ml
        'miel': { to100g: 21 }, // 1 c.à.s. ≈ 21g
        'pâte de curry': { to100g: 15 }, // 1 c.à.s. ≈ 15g
        'nuoc mam': { to100g: 15 }, // 1 c.à.s. ≈ 15ml
        'vinaigre de riz': { to100g: 15 }, // 1 c.à.s. ≈ 15ml
        'mayonnaise': { to100g: 15 }, // 1 c.à.s. ≈ 15g
    },
    'tsp': {
        'cumin': { to100g: 2 }, // 1 c.à.c. ≈ 2g
        'paprika': { to100g: 2 },
        'curry': { to100g: 2 },
        'thym': { to100g: 2 },
        'cannelle': { to100g: 2 },
        'moutarde': { to100g: 5 }, // 1 c.à.c. ≈ 5g
        'safran': { to100g: 0.2 }, // 1 c.à.c. ≈ 0.2g
        'noix de muscade': { to100g: 2 },
        'coriandre en poudre': { to100g: 2 },
        'herbes de provence': { to100g: 2 },
        'wasabi': { to100g: 5 }, // 1 c.à.c. ≈ 5g
        'sucre': { to100g: 4 }, // 1 c.à.c. ≈ 4g
    },
    'ml': {
        'lait': { to100g: 1 }, // 1ml = 1g pour le lait
        'crème fraîche': { to100g: 1 },
        'bouillon de légumes': { to100g: 1 },
        'bouillon de poulet': { to100g: 1 },
        'bouillon de poisson': { to100g: 1 },
        'vin rouge': { to100g: 1 },
        'vin blanc': { to100g: 1 },
        'lait de coco': { to100g: 1 },
    },
    'clove': {
        'ail': { to100g: 3 }, // 1 gousse d'ail ≈ 3g
    },
    'pinch': {
        'sel': { to100g: 0.5 }, // 1 pincée ≈ 0.5g
        'poivre': { to100g: 0.5 },
    },
    'bunch': {
        'persil': { to100g: 20 }, // 1 bouquet ≈ 20g
        'basilic': { to100g: 30 }, // 1 bouquet ≈ 30g
        'coriandre': { to100g: 30 },
        'ciboulette': { to100g: 10 }, // 1 bouquet ≈ 10g
        'aneth': { to100g: 15 }, // 1 bouquet ≈ 15g
        'thym': { to100g: 5 }, // 1 bouquet de thym ≈ 5g
    },
    'slice': {
        'jambon': { to100g: 20 }, // 1 tranche ≈ 20g
        'bacon': { to100g: 10 }, // 1 tranche ≈ 10g
        'pain': { to100g: 30 }, // 1 tranche ≈ 30g
    },
};

                                                                                                                                                                                                                                                                                                                                            