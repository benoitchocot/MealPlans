<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader>
      <template #actions>
        <NuxtLink to="/recipes" class="btn btn-secondary text-sm">
          {{ $t('recipes.backToRecipes') }}
        </NuxtLink>
        <button @click="handleLogout" class="btn btn-secondary text-sm">
          {{ $t('auth.logout') }}
        </button>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
        <NuxtLink to="/recipes" class="btn btn-primary mt-4">
          {{ $t('recipes.backToRecipes') }}
        </NuxtLink>
      </div>

      <div v-else-if="adjustedRecipe" class="space-y-6">
        <div class="card">
          <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center">
            <Icon name="mdi:silverware-fork-knife" class="text-8xl text-primary-600" />
          </div>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ adjustedRecipe.title }}</h1>
          
          <p v-if="adjustedRecipe.description" class="text-gray-600 text-lg mb-6">{{ adjustedRecipe.description }}</p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="mdi:clock-outline" class="text-2xl text-primary-600 mb-2 mx-auto" />
              <p class="text-sm text-gray-600">{{ $t('recipes.prepTime') }}</p>
              <p class="text-lg font-semibold">{{ adjustedRecipe.prepTime }} {{ $t('recipes.min') }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="mdi:fire" class="text-2xl text-primary-600 mb-2 mx-auto" />
              <p class="text-sm text-gray-600">{{ $t('recipes.cookTime') }}</p>
              <p class="text-lg font-semibold">{{ adjustedRecipe.cookTime }} {{ $t('recipes.min') }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="mdi:account-group" class="text-2xl text-primary-600 mb-2 mx-auto" />
              <p class="text-sm text-gray-600">{{ $t('recipes.servings') }}</p>
              <p class="text-lg font-semibold">{{ adjustedRecipe.servings }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="mdi:gauge" class="text-2xl text-primary-600 mb-2 mx-auto" />
              <p class="text-sm text-gray-600">{{ $t('recipes.difficulty') }}</p>
              <p class="text-lg font-semibold">{{ translateDifficulty(adjustedRecipe.difficulty) }}</p>
            </div>
          </div>

          <div v-if="adjustedRecipe.tags && adjustedRecipe.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in adjustedRecipe.tags"
              :key="tag"
              class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {{ translateTag(tag) }}
            </span>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="card">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('recipes.ingredients') }}</h2>
            <ul class="space-y-2">
              <li
                v-for="ingredient in adjustedRecipe.ingredients"
                :key="ingredient.id"
                class="flex items-center justify-between p-2 border-b border-gray-100"
              >
                <span class="text-gray-700">{{ ingredient.ingredient.name }}</span>
                <span class="text-gray-600 font-medium">
                  {{ formatQuantity(ingredient.quantity) }} {{ translateUnit(ingredient.unit) }}
                </span>
              </li>
            </ul>
          </div>

          <div class="card">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('recipes.instructions') }}</h2>
            <ol class="space-y-4">
              <li
                v-for="step in adjustedRecipe.steps"
                :key="step.id"
                class="flex gap-3"
              >
                <span class="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                  {{ step.stepNumber }}
                </span>
                <p class="text-gray-700 flex-1 pt-1">{{ step.instruction }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()
const api = useApi()
const { translateDifficulty, translateUnit, translateTag } = useTranslations()

const recipe = ref<any>(null)
const userSettings = ref<any>(null)
const loading = ref(true)
const error = ref('')

const householdSize = computed(() => userSettings.value?.householdSize || 1)

// Adjust quantities based on household size (recipes are for 1 person)
const adjustedRecipe = computed(() => {
  if (!recipe.value) return null
  
  return {
    ...recipe.value,
    servings: householdSize.value,
    ingredients: recipe.value.ingredients.map((ing: any) => ({
      ...ing,
      quantity: Number(ing.quantity) * householdSize.value,
    })),
  }
})

const handleLogout = () => {
  logout()
}

// Format quantity to show reasonable decimals
const formatQuantity = (quantity: number) => {
  if (quantity % 1 === 0) {
    return quantity.toString()
  }
  // Show max 2 decimals
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}

onMounted(async () => {
  try {
    // Fetch recipe and user settings in parallel
    const [recipeData, settings] = await Promise.all([
      api.get(`/recipes/${route.params.id}`),
      api.get('/users/me/settings').catch(() => null), // Settings optional
    ])
    
    recipe.value = recipeData
    userSettings.value = settings
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
