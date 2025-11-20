export const useTranslations = () => {
  const { t } = useI18n()

  const translateDifficulty = (difficulty: string) => {
    return t(`enums.difficulty.${difficulty}`) || difficulty
  }

  const translateUnit = (unit: string) => {
    return t(`enums.unit.${unit}`) || unit
  }

  const translateDietType = (dietType: string) => {
    return t(`enums.dietType.${dietType}`) || dietType
  }

  const translateIngredientCategory = (category: string) => {
    return t(`enums.ingredientCategory.${category}`) || category
  }

  const translateShoppingListStatus = (status: string) => {
    return t(`enums.shoppingListStatus.${status}`) || status
  }

  const translateTag = (tag: string) => {
    return t(`tags.${tag}`) || tag
  }

  const translateTool = (tool: string) => {
    return t(`tools.${tool}`) || tool
  }

  return {
    translateDifficulty,
    translateUnit,
    translateDietType,
    translateIngredientCategory,
    translateShoppingListStatus,
    translateTag,
    translateTool,
  }
}

