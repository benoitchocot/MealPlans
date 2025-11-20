<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      :aria-label="$t('common.changeLanguage')"
    >
      <span class="text-2xl">{{ currentLocale.flag }}</span>
      <span class="text-sm font-medium hidden sm:inline">{{ currentLocale.name }}</span>
      <Icon name="mdi:chevron-down" class="text-sm" />
    </button>

    <Transition name="fade">
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      >
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
          :class="{ 'bg-primary-50 text-primary-700': locale.code === currentLocale.code }"
        >
          <span class="text-xl">{{ locale.flag }}</span>
          <span class="text-sm font-medium">{{ locale.name }}</span>
          <Icon
            v-if="locale.code === currentLocale.code"
            name="mdi:check"
            class="ml-auto text-primary-600"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const availableLocales = computed(() => locales.value)
const currentLocale = computed(() => {
  return availableLocales.value.find((l: any) => l.code === locale.value) || availableLocales.value[0]
})

const switchLocale = async (code: string) => {
  await setLocale(code)
  showDropdown.value = false
}

useClickOutside(dropdownRef, () => {
  showDropdown.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

