export const useUserSettings = () => {
  const api = useApi()
  const settings = useState<any | null>('userSettings', () => null)
  const hasSettings = computed(() => !!settings.value)

  const fetchSettings = async () => {
    try {
      const data = await api.get('/users/me/settings')
      settings.value = data
      return data
    } catch (error) {
      settings.value = null
      throw error
    }
  }

  const updateSettings = async (data: any) => {
    try {
      const updated = await api.patch('/users/me/settings', data)
      settings.value = updated
      return updated
    } catch (error) {
      throw error
    }
  }

  // Check if user has completed onboarding (has settings with tools)
  const hasCompletedOnboarding = computed(() => {
    return settings.value && 
           settings.value.toolsAvailable && 
           settings.value.toolsAvailable.length > 0
  })

  return {
    settings,
    hasSettings,
    hasCompletedOnboarding,
    fetchSettings,
    updateSettings,
  }
}

