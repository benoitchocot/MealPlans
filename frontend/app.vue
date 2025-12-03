<template>
  <div>
    <NotificationContainer />
    <OfflineIndicator />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { isOnline } = useOffline()
const { loadFavorites } = useFavorites()
const config = useRuntimeConfig()

// Debug: Afficher la configuration de l'API au démarrage
onMounted(() => {
  if (import.meta.client) {
    console.log('🔧 Configuration API:', {
      apiBase: config.public.apiBase,
      origin: window.location?.origin,
      userAgent: navigator.userAgent,
      isCapacitor: !!(window as any).Capacitor
    })
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    loadFavorites().catch((error) => {
      // Silently fail if user is not authenticated
      console.error('Failed to load favorites:', error)
    })
  }
})
</script>
