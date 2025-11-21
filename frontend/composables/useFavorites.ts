export const useFavorites = () => {
  const api = useApi()
  // Use useState to share state across all components
  const favoriteIds = useState<Set<string>>('favoriteIds', () => new Set())
  const favoriteRecipes = useState<any[]>('favoriteRecipes', () => [])
  const loading = useState<boolean>('favoritesLoading', () => false)

  // Load favorite IDs on mount
  const loadFavorites = async () => {
    try {
      loading.value = true
      const response = await api.get<{ favoriteIds: string[] }>('/history/favorites')
      favoriteIds.value = new Set(response.favoriteIds || [])
      // If favoriteRecipes is already loaded, sync them
      if (favoriteRecipes.value.length > 0) {
        const recipeIds = new Set(favoriteRecipes.value.map(r => r.id))
        favoriteIds.value = recipeIds
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      loading.value = false
    }
  }

  // Load favorite recipes with details
  const loadFavoriteRecipes = async () => {
    try {
      const history = await api.get('/history')
      favoriteRecipes.value = history.favoriteRecipes || []
      // Sync favoriteIds with favoriteRecipes
      const ids = new Set(favoriteRecipes.value.map(r => r.id))
      favoriteIds.value = ids
    } catch (error) {
      console.error('Failed to load favorite recipes:', error)
    }
  }

  // Check if a recipe is favorited
  const isFavorite = (recipeId: string): boolean => {
    return favoriteIds.value.has(recipeId)
  }

  // Toggle favorite status
  const toggleFavorite = async (recipeId: string, recipe?: any): Promise<boolean> => {
    const wasFavorite = isFavorite(recipeId)
    
    try {
      if (wasFavorite) {
        await api.delete(`/history/recipes/${recipeId}/favorite`)
        favoriteIds.value.delete(recipeId)
        // Remove from favorite recipes list immediately
        favoriteRecipes.value = favoriteRecipes.value.filter(r => r.id !== recipeId)
      } else {
        await api.post(`/history/recipes/${recipeId}/favorite`)
        favoriteIds.value.add(recipeId)
        // If recipe details provided, add immediately, otherwise reload
        if (recipe) {
          favoriteRecipes.value = [...favoriteRecipes.value, recipe]
        } else {
          await loadFavoriteRecipes()
        }
      }
      return !wasFavorite
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      throw error
    }
  }

  // Add to favorites
  const addFavorite = async (recipeId: string, recipe?: any) => {
    if (isFavorite(recipeId)) return
    await toggleFavorite(recipeId, recipe)
  }

  // Remove from favorites
  const removeFavorite = async (recipeId: string) => {
    if (!isFavorite(recipeId)) return
    await toggleFavorite(recipeId)
  }

  return {
    favoriteIds,
    favoriteRecipes,
    loading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    loadFavorites,
    loadFavoriteRecipes,
  }
}

