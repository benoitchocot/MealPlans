export interface JourneyStep {
  id: string
  title: string
  description: string
  completed: boolean
  route?: string
  action?: () => void
}

export const useUserJourney = () => {
  const api = useApi()
  const router = useRouter()
  
  // Track journey progress in localStorage
  const journeyProgress = useState<Record<string, boolean>>('journeyProgress', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('userJourneyProgress')
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })

  // Save progress to localStorage
  const saveProgress = () => {
    if (import.meta.client) {
      localStorage.setItem('userJourneyProgress', JSON.stringify(journeyProgress.value))
    }
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = computed(() => {
    return journeyProgress.value.onboarding === true
  })

  // Check if user has generated a meal plan (async function, not computed)
  const checkHasGeneratedMealPlan = async (): Promise<boolean> => {
    try {
      const mealPlans = await api.get('/meal-plans')
      return Array.isArray(mealPlans) && mealPlans.length > 0
    } catch {
      return false
    }
  }

  // Check if user has created a shopping list (async function, not computed)
  const checkHasCreatedShoppingList = async (): Promise<boolean> => {
    try {
      const lists = await api.get('/shopping-lists')
      return Array.isArray(lists) && lists.length > 0
    } catch {
      return false
    }
  }

  // Mark step as completed
  const completeStep = (stepId: string) => {
    journeyProgress.value[stepId] = true
    saveProgress()
  }

  // Reset journey (for testing or new user)
  const resetJourney = () => {
    journeyProgress.value = {}
    saveProgress()
  }

  // Get current step in journey
  const getCurrentStep = async (): Promise<string | null> => {
    if (!hasCompletedOnboarding.value) {
      return 'onboarding'
    }
    
    const hasMealPlan = await checkHasGeneratedMealPlan()
    if (!hasMealPlan) {
      return 'generate-meal-plan'
    }
    
    const hasList = await checkHasCreatedShoppingList()
    if (!hasList) {
      return 'create-shopping-list'
    }
    
    return null // Journey complete
  }

  // Check if user is new (no progress)
  const isNewUser = computed(() => {
    return Object.keys(journeyProgress.value).length === 0
  })

  return {
    journeyProgress: readonly(journeyProgress),
    hasCompletedOnboarding,
    checkHasGeneratedMealPlan,
    checkHasCreatedShoppingList,
    completeStep,
    resetJourney,
    getCurrentStep,
    isNewUser,
  }
}

