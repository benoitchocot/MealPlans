<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('settings.title') }}</h2>
        <p class="text-gray-600">{{ $t('settings.subtitle') }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Household Size -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.householdSize') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="size in [1, 2, 3, 4, 5, 6]"
              :key="size"
              @click="formData.householdSize = size"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-center',
                formData.householdSize === size
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <div class="text-2xl font-bold">{{ size }}</div>
              <div class="text-sm">{{ size === 1 ? $t('onboarding.step1.person') : $t('onboarding.step1.people') }}</div>
            </button>
          </div>
        </div>

        <!-- Meals per week -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.mealsPerWeek') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="meals in [3, 5, 7, 10, 14, 21]"
              :key="meals"
              @click="formData.defaultMealsPerWeek = meals"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-center',
                formData.defaultMealsPerWeek === meals
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <div class="text-2xl font-bold">{{ meals }}</div>
              <div class="text-sm">{{ $t('onboarding.step2.meals') }}</div>
            </button>
          </div>
        </div>

        <!-- Kitchen Tools -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.kitchenTools') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="tool in availableTools"
              :key="tool.value"
              @click="toggleTool(tool.value)"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-left',
                formData.toolsAvailable.includes(tool.value)
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <Icon :name="tool.icon" class="text-2xl mb-2" />
              <div class="font-medium">{{ tool.label }}</div>
            </button>
          </div>
        </div>

        <!-- Diet Preferences -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.dietPreferences') }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ $t('settings.dietPreferencesHint') }}</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="diet in availableDiets"
              :key="diet.value"
              @click="toggleDiet(diet.value)"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-left',
                formData.dietPreferences.includes(diet.value)
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <Icon :name="diet.icon" class="text-2xl mb-2" />
              <div class="font-medium text-sm">{{ diet.label }}</div>
            </button>
          </div>
        </div>

        <!-- Difficulty & Prep Time -->
        <div class="card">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.difficultyAndTime') }}</h3>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ $t('settings.difficulty') }}
              </label>
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="difficulty in ['EASY', 'MEDIUM', 'HARD']"
                  :key="difficulty"
                  @click="formData.difficultyPreference = difficulty"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all text-center',
                    formData.difficultyPreference === difficulty
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  ]"
                >
                  <div class="font-medium">{{ translateDifficulty(difficulty) }}</div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ $t('settings.maxPrepTime') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="time in [15, 30, 45, 60]"
                  :key="time"
                  @click="formData.maxPrepTime = time"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all text-center',
                    formData.maxPrepTime === time
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  ]"
                >
                  <div class="text-xl font-bold">{{ time }}</div>
                  <div class="text-sm">{{ $t('recipes.min') }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end gap-4">
          <NuxtLink to="/dashboard" class="btn btn-secondary">
            {{ $t('common.cancel') }}
          </NuxtLink>
          <button
            @click="handleSave"
            :disabled="loading"
            class="btn btn-primary"
          >
            {{ loading ? $t('common.loading') : $t('common.save') }}
          </button>
        </div>

        <div v-if="saveError" class="text-red-600 text-sm text-center">
          {{ saveError }}
        </div>
        <div v-if="saveSuccess" class="text-green-600 text-sm text-center">
          {{ $t('settings.saved') }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const router = useRouter()
const { t } = useI18n()
const { translateDifficulty } = useTranslations()

const loading = ref(true)
const error = ref('')
const saveError = ref('')
const saveSuccess = ref(false)

const formData = ref({
  householdSize: 2,
  defaultMealsPerWeek: 5,
  toolsAvailable: [] as string[],
  dietPreferences: [] as string[],
  difficultyPreference: 'EASY' as 'EASY' | 'MEDIUM' | 'HARD',
  maxPrepTime: 30,
})

const availableTools = [
  { value: 'oven', label: t('tools.oven'), icon: 'mdi:stove' },
  { value: 'microwave', label: t('tools.microwave'), icon: 'mdi:microwave' },
  { value: 'blender', label: t('tools.blender'), icon: 'mdi:blender' },
  { value: 'casserole', label: t('tools.casserole'), icon: 'mdi:pot-steam' },
]

const availableDiets = [
  { value: 'VEGETARIAN', label: t('enums.dietType.VEGETARIAN'), icon: 'mdi:leaf' },
  { value: 'VEGAN', label: t('enums.dietType.VEGAN'), icon: 'mdi:leaf-circle' },
  { value: 'HALAL', label: t('enums.dietType.HALAL'), icon: 'mdi:food-halal' },
  { value: 'KOSHER', label: t('enums.dietType.KOSHER'), icon: 'mdi:food-kosher' },
  { value: 'NO_PORK', label: t('enums.dietType.NO_PORK'), icon: 'mdi:food-off' },
  { value: 'NO_BEEF', label: t('enums.dietType.NO_BEEF'), icon: 'mdi:food-off' },
  { value: 'PESCATARIAN', label: t('enums.dietType.PESCATARIAN'), icon: 'mdi:fish' },
  { value: 'GLUTEN_FREE', label: t('enums.dietType.GLUTEN_FREE'), icon: 'mdi:grain' },
  { value: 'DAIRY_FREE', label: t('enums.dietType.DAIRY_FREE'), icon: 'mdi:cup-off' },
  { value: 'NUT_FREE', label: t('enums.dietType.NUT_FREE'), icon: 'mdi:nuts' },
]

const toggleTool = (tool: string) => {
  const index = formData.value.toolsAvailable.indexOf(tool)
  if (index > -1) {
    formData.value.toolsAvailable.splice(index, 1)
  } else {
    formData.value.toolsAvailable.push(tool)
  }
}

const toggleDiet = (diet: string) => {
  const index = formData.value.dietPreferences.indexOf(diet)
  if (index > -1) {
    formData.value.dietPreferences.splice(index, 1)
  } else {
    formData.value.dietPreferences.push(diet)
  }
}

const handleSave = async () => {
  loading.value = true
  saveError.value = ''
  saveSuccess.value = false

  try {
    await api.patch('/users/me/settings', formData.value)
    saveSuccess.value = true
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (e: any) {
    saveError.value = e.message || t('settings.saveError')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const settings = await api.get('/users/me/settings')
    if (settings) {
      formData.value = {
        householdSize: settings.householdSize || 2,
        defaultMealsPerWeek: settings.defaultMealsPerWeek || 5,
        toolsAvailable: settings.toolsAvailable || [],
        dietPreferences: settings.dietPreferences || [],
        difficultyPreference: settings.difficultyPreference || 'EASY',
        maxPrepTime: settings.maxPrepTime || 30,
      }
    }
  } catch (e: any) {
    error.value = e.message || t('settings.loadError')
  } finally {
    loading.value = false
  }
})

definePageMeta({
  middleware: 'auth',
})
</script>

