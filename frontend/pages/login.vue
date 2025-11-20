<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600 mb-2">{{ $t('common.appName') }}</h1>
        <p class="text-gray-600">Planification de repas simplifiée</p>
      </div>

      <div class="card">
        <h2 class="text-2xl font-bold mb-6">{{ $t('auth.login') }}</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
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
            {{ loading ? $t('auth.loggingIn') : $t('auth.login') }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ $t('auth.dontHaveAccount') }}
            <NuxtLink to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ $t('auth.register') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || $t('auth.loginFailed')
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
