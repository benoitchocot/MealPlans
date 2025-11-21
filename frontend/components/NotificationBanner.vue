<template>
  <div
    :class="[
      'p-4 shadow-lg rounded-lg pointer-events-auto',
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon
          :name="type === 'success' ? 'mdi:check-circle' : type === 'error' ? 'mdi:alert-circle' : 'mdi:information'"
          class="text-2xl text-white"
        />
        <p class="text-white font-medium">{{ message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="text-white hover:text-gray-200 transition-colors"
      >
        <Icon name="mdi:close" class="text-2xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 5000,
})

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
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

