export const useOffline = () => {
  const isOnline = ref(import.meta.client ? navigator.onLine : true)
  const isOffline = computed(() => !isOnline.value)

  const updateOnlineStatus = () => {
    if (import.meta.client) {
      isOnline.value = navigator.onLine
    }
  }

  onMounted(() => {
    if (import.meta.client) {
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
    }
  })

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  })

  // Vérifier si une ressource est disponible dans le cache
  const isCached = async (url: string): Promise<boolean> => {
    if (!('caches' in window)) return false

    try {
      const cache = await caches.open('recipes-cache')
      const response = await cache.match(url)
      return !!response
    } catch {
      return false
    }
  }

  // Obtenir une ressource depuis le cache
  const getFromCache = async <T>(url: string): Promise<T | null> => {
    if (!('caches' in window)) return null

    try {
      const cache = await caches.open('recipes-cache')
      const response = await cache.match(url)
      if (response) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error getting from cache:', error)
    }

    return null
  }

  return {
    isOnline,
    isOffline,
    isCached,
    getFromCache,
  }
}

