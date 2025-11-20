export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip check if already on onboarding page or login/register
  if (to.path === '/onboarding' || to.path === '/login' || to.path === '/register' || to.path === '/') {
    return
  }

  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    try {
      const api = useApi()
      const settings = await api.get('/users/me/settings')
      
      // Check if user has completed onboarding (has tools configured)
      if (!settings || !settings.toolsAvailable || settings.toolsAvailable.length === 0) {
        return navigateTo('/onboarding')
      }
    } catch (error: any) {
      // If 404, user has no settings yet - redirect to onboarding
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        return navigateTo('/onboarding')
      }
      // For other errors, allow access (will be handled by auth middleware)
      console.error('Error checking onboarding status:', error)
    }
  }
})

