<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600 mb-2">{{ $t('common.appName') }}</h1>
        <p class="text-gray-600">{{ $t('auth.subtitle') }}</p>
      </div>

      <div class="card">
        <h2 class="text-2xl font-bold mb-6">{{ $t('auth.register') }}</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.name') }}</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="input"
              :placeholder="$t('auth.namePlaceholder')"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input"
              :placeholder="$t('auth.loginPlaceholder')"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.password') }}</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              class="input"
              :placeholder="$t('auth.passwordPlaceholder')"
            />
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? $t('auth.creatingAccount') : $t('auth.register') }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ $t('auth.alreadyHaveAccount') }}
            <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ $t('auth.login') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await register(name.value, email.value, password.value)
    // useAuth will redirect to /onboarding automatically
  } catch (e: any) {
    error.value = e.message || t('auth.registrationFailed')
    loading.value = false
  }
}

definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
