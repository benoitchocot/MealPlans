<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader>
      <template #actions>
        <NuxtLink to="/meal-plans" class="btn btn-secondary text-sm">
          {{ $t('mealPlans.backToMealPlans') }}
        </NuxtLink>
      </template>
    </AppHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="card">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('mealPlans.generate.title') }}</h2>

        <form v-if="!generatedPlan" @submit.prevent="handleGenerate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('mealPlans.generate.startDate') }}
              </label>
              <input
                id="startDate"
                v-model="startDate"
                type="date"
                required
                class="input"
              />
            </div>

            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('mealPlans.generate.endDate') }}
              </label>
              <input
                id="endDate"
                v-model="endDate"
                type="date"
                required
                class="input"
              />
            </div>
          </div>

          <div>
            <label for="numberOfMeals" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('mealPlans.generate.numberOfMeals') }}
            </label>
            <input
              id="numberOfMeals"
              v-model.number="numberOfMeals"
              type="number"
              min="1"
              max="21"
              required
              class="input"
            />
            <p class="text-sm text-gray-500 mt-1">{{ $t('mealPlans.generate.numberOfMealsHint') }}</p>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? $t('mealPlans.generate.generating') : $t('mealPlans.generate.generate') }}
          </button>
        </form>
      </div>

      <!-- Generated Recipes Preview -->
      <div v-if="generatedPlan" class="mt-8 space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">✓ {{ $t('mealPlans.generate.generated') }}</h3>
              <p class="text-gray-600">{{ generatedPlan.title }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ generatedPlan.recipes?.length || 0 }} {{ $t('mealPlans.generate.recipesSelected') }}</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="handleNewGeneration"
                class="btn btn-secondary"
              >
                <Icon name="mdi:plus" class="mr-2" />
                {{ $t('mealPlans.generate.newGeneration') }}
              </button>
              <button
                @click="handleRegenerate"
                :disabled="loading"
                class="btn btn-secondary"
              >
                <Icon name="mdi:refresh" class="mr-2" />
                {{ loading ? $t('mealPlans.generate.generating') : $t('mealPlans.generate.regenerate') }}
              </button>
              <NuxtLink :to="`/meal-plans/${generatedPlan.id}`" class="btn btn-primary">
                {{ $t('mealPlans.generate.viewMealPlan') }}
              </NuxtLink>
            </div>
          </div>

          <div v-if="generatedPlan.recipes && generatedPlan.recipes.length > 0">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('mealPlans.generate.recipesPreview') }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <NuxtLink
                v-for="mealPlanRecipe in generatedPlan.recipes"
                :key="mealPlanRecipe.id"
                :to="`/recipes/${mealPlanRecipe.recipe.id}`"
                class="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center">
                  <Icon name="mdi:silverware-fork-knife" class="text-4xl text-primary-600" />
                </div>
                <h5 class="font-semibold text-sm mb-1 line-clamp-2">{{ mealPlanRecipe.recipe.title }}</h5>
                <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span class="flex items-center">
                    <Icon name="mdi:clock-outline" class="mr-1" />
                    {{ mealPlanRecipe.recipe.prepTime + mealPlanRecipe.recipe.cookTime }} {{ $t('recipes.min') }}
                  </span>
                  <span class="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {{ translateDifficulty(mealPlanRecipe.recipe.difficulty) }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from '~/composables/useTranslations'

const api = useApi()
const router = useRouter()
const { t } = useI18n()
const { translateDifficulty } = useTranslations()

const startDate = ref('')
const endDate = ref('')
const numberOfMeals = ref(5)
const loading = ref(false)
const error = ref('')
const generatedPlan = ref<any>(null)
const lastGenerationParams = ref<{
  startDate: string
  endDate: string
  numberOfMeals: number
} | null>(null)

// Set default dates (today + 7 days)
onMounted(() => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  const todayStr = today.toISOString().split('T')[0]
  const nextWeekStr = nextWeek.toISOString().split('T')[0]
  
  if (todayStr) startDate.value = todayStr
  if (nextWeekStr) endDate.value = nextWeekStr
})

const handleGenerate = async () => {
  loading.value = true
  error.value = ''
  generatedPlan.value = null
  
  const params = {
    startDate: startDate.value,
    endDate: endDate.value,
    numberOfMeals: numberOfMeals.value,
  }
  
  // Save parameters for regeneration
  lastGenerationParams.value = params
  
  try {
    const plan = await api.post('/meal-plans/generate', params)
    generatedPlan.value = plan
  } catch (e: any) {
    error.value = e.message || t('mealPlans.generate.failed')
  } finally {
    loading.value = false
  }
}

const handleRegenerate = async () => {
  if (!lastGenerationParams.value) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  // Save the old plan ID to delete it
  const oldPlanId = generatedPlan.value?.id
  
  // Clear the current plan display
  generatedPlan.value = null
  
  try {
    // Delete the old plan if it exists
    if (oldPlanId) {
      try {
        await api.delete(`/meal-plans/${oldPlanId}`)
      } catch (deleteError: any) {
        // If deletion fails, log but continue (plan might already be deleted)
        console.warn('Failed to delete old plan:', deleteError)
      }
    }
    
    // Generate new plan
    const plan = await api.post('/meal-plans/generate', lastGenerationParams.value)
    generatedPlan.value = plan
  } catch (e: any) {
    error.value = e.message || t('mealPlans.generate.failed')
  } finally {
    loading.value = false
  }
}

const handleNewGeneration = () => {
  generatedPlan.value = null
  lastGenerationParams.value = null
  error.value = ''
}

definePageMeta({
  middleware: 'auth',
})
</script>
