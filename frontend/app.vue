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

// Load favorites when app starts (if user is authenticated)
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      await loadFavorites()
    } catch (error) {
      // Silently fail if user is not authenticated
      console.error('Failed to load favorites:', error)
    }
  }
})
</script>
