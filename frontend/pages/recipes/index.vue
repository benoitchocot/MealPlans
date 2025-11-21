<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('recipes.title') }}</h2>
          <p class="text-gray-600 mb-6">{{ $t('recipes.subtitle') }}</p>
        </div>
        <NuxtLink to="/recipes/submit" class="btn btn-primary">
          <Icon name="mdi:plus" class="mr-2" />
          {{ $t('recipes.submitRecipe') }}
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">{{ $t('recipes.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-if="!loading && recipes.length === 0" class="text-center py-12">
        <p class="text-gray-600">{{ $t('recipes.noRecipes') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const { loadFavorites } = useFavorites()

const recipes = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Load favorites and recipes in parallel
    await Promise.all([
      loadFavorites(),
      (async () => {
        const response = await api.get('/recipes')
        recipes.value = response.data || response
      })(),
    ])
  } catch (e: any) {
    error.value = e.message || $t('common.error')
  } finally {
    loading.value = false
  }
})

definePageMeta({
  middleware: 'auth',
})
</script>
