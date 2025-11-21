<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ $t('onboarding.step') }} {{ currentStep }} / {{ totalSteps }}
          </span>
          <span class="text-sm text-gray-500">{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="card">
        <!-- Step 1: Household Size -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center mb-6">
            <Icon name="mdi:account-group" class="text-6xl text-primary-600 mb-4" />
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('onboarding.step1.title') }}</h2>
            <p class="text-gray-600">{{ $t('onboarding.step1.description') }}</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="size in [1, 2, 3, 4, 5, 6]"
              :key="size"
              @click="formData.householdSize = size"
              :class="[
                'p-6 rounded-lg border-2 transition-all',
                formData.householdSize === size
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <div class="text-3xl font-bold mb-2">{{ size }}</div>
              <div class="text-sm">{{ size === 1 ? $t('onboarding.step1.person') : $t('onboarding.step1.people') }}</div>
            </button>
          </div>
        </div>

        <!-- Step 2: Meals per week -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center mb-6">
            <Icon name="mdi:calendar-week" class="text-6xl text-primary-600 mb-4" />
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('onboarding.step2.title') }}</h2>
            <p class="text-gray-600">{{ $t('onboarding.step2.description') }}</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="meals in [3, 5, 7, 10, 14, 21]"
              :key="meals"
              @click="formData.defaultMealsPerWeek = meals"
              :class="[
                'p-6 rounded-lg border-2 transition-all',
                formData.defaultMealsPerWeek === meals
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              ]"
            >
              <div class="text-3xl font-bold mb-2">{{ meals }}</div>
              <div class="text-sm">{{ $t('onboarding.step2.meals') }}</div>
            </button>
          </div>
        </div>

        <!-- Step 3: Kitchen Tools -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center mb-6">
            <Icon name="mdi:chef-hat" class="text-6xl text-primary-600 mb-4" />
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('onboarding.step3.title') }}</h2>
            <p class="text-gray-600">{{ $t('onboarding.step3.description') }}</p>
          </div>

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

        <!-- Step 4: Diet Preferences -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="text-center mb-6">
            <Icon name="mdi:food" class="text-6xl text-primary-600 mb-4" />
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('onboarding.step4.title') }}</h2>
            <p class="text-gray-600">{{ $t('onboarding.step4.description') }}</p>
          </div>

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

        <!-- Step 5: Difficulty & Prep Time -->
        <div v-if="currentStep === 5" class="space-y-6">
          <div class="text-center mb-6">
            <Icon name="mdi:gauge" class="text-6xl text-primary-600 mb-4" />
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('onboarding.step5.title') }}</h2>
            <p class="text-gray-600">{{ $t('onboarding.step5.description') }}</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ $t('onboarding.step5.difficulty') }}
              </label>
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="difficulty in ['EASY', 'MEDIUM', 'HARD']"
                  :key="difficulty"
                  @click="formData.difficultyPreference = difficulty"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all',
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
                {{ $t('onboarding.step5.maxPrepTime') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="time in [15, 30, 45, 60]"
                  :key="time"
                  @click="formData.maxPrepTime = time"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all',
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

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            class="btn btn-secondary"
          >
            {{ $t('common.previous') }}
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            :disabled="!canProceed"
            class="btn btn-primary"
          >
            {{ $t('common.next') }}
          </button>
          <button
            v-else
            @click="handleSubmit"
            :disabled="loading || !canProceed"
            class="btn btn-primary"
          >
            {{ loading ? $t('onboarding.saving') : $t('onboarding.finish') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const router = useRouter()
const { t } = useI18n()
const { translateDifficulty } = useTranslations()
const { fetchProfile } = useAuth()

const currentStep = ref(1)
const totalSteps = 5
const loading = ref(false)
const error = ref('')

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

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.householdSize > 0
    case 2:
      return formData.value.defaultMealsPerWeek > 0
    case 3:
      return formData.value.toolsAvailable.length > 0
    case 4:
      return true // Diet preferences are optional
    case 5:
      return true // Difficulty and prep time have defaults
    default:
      return false
  }
})

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

const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await api.patch('/users/me/settings', formData.value)
    await fetchProfile()
    
    // Mark onboarding as completed
    const { completeStep } = useUserJourney()
    completeStep('onboarding')
    
    // Redirect to meal plan generation to guide user through next step
    router.push('/meal-plans/generate')
  } catch (e: any) {
    error.value = e.message || t('onboarding.error')
  } finally {
    loading.value = false
  }
}

definePageMeta({
  middleware: 'auth',
  layout: false,
})
</script>

