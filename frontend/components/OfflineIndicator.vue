<template>
  <Transition name="slide-down">
    <div
      v-if="isOffline"
      class="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50 shadow-md"
    >
      <div class="flex items-center justify-center gap-2">
        <Icon name="mdi:wifi-off" class="text-xl" />
        <span class="text-sm font-medium">{{ $t('common.offlineMode') }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOffline } = useOffline()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>

