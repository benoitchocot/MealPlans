<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ $t('common.welcome') }}, {{ user?.name || $t('common.user') }}! 👋
        </h2>
        <p class="text-gray-600">{{ $t('dashboard.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink to="/recipes" class="card hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <Icon name="mdi:book-open-variant" class="text-2xl text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold">{{ $t('dashboard.recipes') }}</h3>
          </div>
          <p class="text-gray-600">{{ $t('dashboard.recipesDescription') }}</p>
        </NuxtLink>

        <NuxtLink to="/meal-plans" class="card hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
              <Icon name="mdi:calendar-month" class="text-2xl text-secondary-600" />
            </div>
            <h3 class="text-xl font-semibold">{{ $t('dashboard.mealPlans') }}</h3>
          </div>
          <p class="text-gray-600">{{ $t('dashboard.mealPlansDescription') }}</p>
        </NuxtLink>

        <NuxtLink to="/shopping-lists" class="card hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Icon name="mdi:cart" class="text-2xl text-green-600" />
            </div>
            <h3 class="text-xl font-semibold">{{ $t('dashboard.shoppingLists') }}</h3>
          </div>
          <p class="text-gray-600">{{ $t('dashboard.shoppingListsDescription') }}</p>
        </NuxtLink>
      </div>

      <div class="mt-12 card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h3 class="text-2xl font-bold mb-4">{{ $t('dashboard.quickStart') }}</h3>
        <p class="mb-6">{{ $t('dashboard.quickStartDescription') }}</p>
        <NuxtLink to="/meal-plans/generate" class="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          {{ $t('dashboard.generateMealPlan') }}
        </NuxtLink>
      </div>

      <div class="mt-6 flex justify-end">
        <NuxtLink to="/settings" class="btn btn-secondary">
          <Icon name="mdi:cog" class="mr-2" />
          {{ $t('settings.title') }}
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}

definePageMeta({
  middleware: ['auth', 'onboarding'],
})
</script>
