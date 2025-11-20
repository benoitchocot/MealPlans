<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div class="text-center">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            {{ $t('landing.hero.title') }}
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {{ $t('landing.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              @click="handleGetStarted"
              class="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              {{ $t('landing.hero.cta') }}
            </button>
            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="btn btn-secondary text-lg px-8 py-4"
            >
              {{ $t('auth.login') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Illustration -->
        <div class="mt-16 flex justify-center">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div class="card bg-white/80 backdrop-blur-sm text-center p-6">
              <Icon name="mdi:calendar-check" class="text-5xl text-primary-600 mb-4 mx-auto" />
              <h3 class="text-lg font-semibold mb-2">{{ $t('landing.features.planning.title') }}</h3>
              <p class="text-gray-600 text-sm">{{ $t('landing.features.planning.description') }}</p>
            </div>
            <div class="card bg-white/80 backdrop-blur-sm text-center p-6">
              <Icon name="mdi:chef-hat" class="text-5xl text-primary-600 mb-4 mx-auto" />
              <h3 class="text-lg font-semibold mb-2">{{ $t('landing.features.recipes.title') }}</h3>
              <p class="text-gray-600 text-sm">{{ $t('landing.features.recipes.description') }}</p>
            </div>
            <div class="card bg-white/80 backdrop-blur-sm text-center p-6">
              <Icon name="mdi:cart" class="text-5xl text-primary-600 mb-4 mx-auto" />
              <h3 class="text-lg font-semibold mb-2">{{ $t('landing.features.shopping.title') }}</h3>
              <p class="text-gray-600 text-sm">{{ $t('landing.features.shopping.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          {{ $t('landing.benefits.title') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:clock-fast" class="text-3xl text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ $t('landing.benefits.time.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.benefits.time.description') }}
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:brain" class="text-3xl text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ $t('landing.benefits.easy.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.benefits.easy.description') }}
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:store" class="text-3xl text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ $t('landing.benefits.drive.title') }}
            </h3>
            <p class="text-gray-600">
              {{ $t('landing.benefits.drive.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          {{ $t('landing.cta.title') }}
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          {{ $t('landing.cta.subtitle') }}
        </p>
        <button
          @click="handleGetStarted"
          class="btn bg-white text-primary-600 text-lg px-8 py-4 hover:bg-gray-100 shadow-lg"
        >
          {{ $t('landing.hero.cta') }}
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h3 class="text-2xl font-bold text-primary-400">{{ $t('common.appName') }}</h3>
            <p class="text-gray-400 text-sm mt-1">{{ $t('landing.footer.tagline') }}</p>
          </div>
          <div class="flex gap-6">
            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="text-gray-300 hover:text-white transition-colors"
            >
              {{ $t('auth.login') }}
            </NuxtLink>
            <NuxtLink
              v-if="!isAuthenticated"
              to="/register"
              class="text-gray-300 hover:text-white transition-colors"
            >
              {{ $t('auth.register') }}
            </NuxtLink>
            <NuxtLink
              v-if="isAuthenticated"
              to="/dashboard"
              class="text-gray-300 hover:text-white transition-colors"
            >
              {{ $t('dashboard.title') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const router = useRouter()

const handleGetStarted = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/register')
  }
}

definePageMeta({
  layout: false,
  // No middleware - allow everyone to see the landing page
})
</script>

