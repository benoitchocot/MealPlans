<template>
  <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none">
    <div class="max-w-7xl mx-auto px-4 pt-4 space-y-2">
      <TransitionGroup name="slide-down">
        <NotificationBanner
          v-for="notification in notifications"
          :key="notification.id"
          :message="notification.message"
          :type="notification.type"
          :duration="0"
          @close="remove(notification.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import NotificationBanner from './NotificationBanner.vue'

const { notifications, remove } = useNotification()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  pointer-events: auto;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

