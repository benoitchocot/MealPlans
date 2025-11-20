<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/dashboard" class="text-2xl font-bold text-primary-600">
          {{ $t('common.appName') }}
        </NuxtLink>
        <div class="flex items-center gap-3">
          <LanguageSwitcher />
          <slot name="actions">
            <button v-if="showLogout" @click="handleLogout" class="btn btn-secondary text-sm">
              {{ $t('auth.logout') }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  showLogout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLogout: true,
})

const { logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

