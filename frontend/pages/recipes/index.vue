<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('recipes.title') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('recipes.subtitle') }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">{{ $t('recipes.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="recipe in recipes"
          :key="recipe.id"
          :to="`/recipes/${recipe.id}`"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
            <Icon name="mdi:silverware-fork-knife" class="text-6xl text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ recipe.title }}</h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ recipe.description }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span class="flex items-center">
              <Icon name="mdi:clock-outline" class="mr-1" />
              {{ recipe.prepTime + recipe.cookTime }} {{ $t('recipes.min') }}
            </span>
            <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {{ translateDifficulty(recipe.difficulty) }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-if="!loading && recipes.length === 0" class="text-center py-12">
        <p class="text-gray-600">{{ $t('recipes.noRecipes') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()
const api = useApi()
const { translateDifficulty } = useTranslations()

const recipes = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const handleLogout = () => {
  logout()
}

onMounted(async () => {
  try {
    const response = await api.get('/recipes')
    recipes.value = response.data || response
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
