<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('favorites.title') }}</h2>
        <p class="text-gray-600">{{ $t('favorites.subtitle') }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">{{ $t('favorites.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="favoriteRecipes.length === 0" class="card text-center py-12">
        <Icon name="mdi:heart-outline" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-600 mb-4">{{ $t('favorites.noFavorites') }}</p>
        <NuxtLink to="/recipes" class="btn btn-primary">
          {{ $t('favorites.browseRecipes') }}
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RecipeCard
          v-for="recipe in favoriteRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const { loadFavorites, loadFavoriteRecipes, favoriteRecipes } = useFavorites()

const loading = ref(true)
const error = ref('')

const refreshFavorites = async () => {
  try {
    loading.value = true
    await Promise.all([
      loadFavorites(),
      loadFavoriteRecipes(),
    ])
  } catch (e: any) {
    error.value = e.message || $t('favorites.error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refreshFavorites()
})

// Watch for favorite changes and refresh
watch(favoriteRecipes, () => {
  // The list will update automatically via reactive favoriteRecipes
}, { deep: true })

definePageMeta({
  middleware: 'auth',
})
</script>

