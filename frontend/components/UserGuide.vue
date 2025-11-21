<template>
  <div v-if="showGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="dismiss">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
      <!-- Close button -->
      <button
        @click="dismiss"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Icon name="mdi:close" class="text-2xl" />
      </button>

      <!-- Content -->
      <div class="p-6">
        <div class="text-center mb-6">
          <Icon :name="currentGuide.icon" class="text-6xl text-primary-600 mb-4" />
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ currentGuide.title }}</h3>
          <p class="text-gray-600">{{ currentGuide.description }}</p>
        </div>

        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">{{ $t('guide.step') }} {{ currentStepIndex + 1 }} / {{ totalSteps }}</span>
            <span class="text-sm text-gray-500">{{ Math.round(((currentStepIndex + 1) / totalSteps) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <button
            v-if="currentGuide.skipable"
            @click="skip"
            class="flex-1 btn btn-secondary"
          >
            {{ $t('guide.skip') }}
          </button>
          <button
            @click="handleAction"
            class="flex-1 btn btn-primary"
          >
            {{ currentGuide.actionLabel || $t('guide.continue') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Guide {
  id: string
  title: string
  description: string
  icon: string
  actionLabel?: string
  action?: () => void
  route?: string
  skipable?: boolean
}

interface Props {
  guide: Guide | null
  currentStepIndex: number
  totalSteps: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  dismiss: []
  skip: []
  action: []
}>()

const showGuide = computed(() => !!props.guide)
const currentGuide = computed(() => props.guide || {
  id: '',
  title: '',
  description: '',
  icon: 'mdi:information',
  actionLabel: '',
})

const dismiss = () => {
  emit('dismiss')
}

const skip = () => {
  emit('skip')
}

const handleAction = () => {
  if (currentGuide.value.action) {
    currentGuide.value.action()
  } else if (currentGuide.value.route) {
    navigateTo(currentGuide.value.route)
  }
  emit('action')
}
</script>

