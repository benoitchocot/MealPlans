<template>
  <header ref="headerRef" class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <NuxtLink to="/dashboard" class="text-xl sm:text-2xl font-bold text-primary-600 truncate flex-shrink-0">
          {{ $t('common.appName') }}
        </NuxtLink>
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <!-- Desktop/Tablet: Navigation links, Language switcher and actions -->
          <div class="hidden md:flex items-center gap-4">
            <!-- Navigation links -->
            <nav class="flex items-center gap-3 lg:gap-4">
              <NuxtLink 
                to="/recipes" 
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
                :class="{ 'text-primary-600': $route.path.startsWith('/recipes') }"
              >
                {{ $t('dashboard.recipes') }}
              </NuxtLink>
              <NuxtLink 
                to="/meal-plans" 
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
                :class="{ 'text-primary-600': $route.path.startsWith('/meal-plans') }"
              >
                {{ $t('dashboard.mealPlans') }}
              </NuxtLink>
              <NuxtLink 
                to="/shopping-lists" 
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
                :class="{ 'text-primary-600': $route.path.startsWith('/shopping-lists') }"
              >
                {{ $t('dashboard.shoppingLists') }}
              </NuxtLink>
              <NuxtLink 
                to="/history" 
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
                :class="{ 'text-primary-600': $route.path.startsWith('/history') }"
              >
                {{ $t('history.title') }}
              </NuxtLink>
              <NuxtLink 
                to="/favorites" 
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
                :class="{ 'text-primary-600': $route.path.startsWith('/favorites') }"
              >
                {{ $t('favorites.title') }}
              </NuxtLink>
            </nav>
          </div>
          <div class="hidden sm:flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <slot name="actions">
              <button v-if="showLogout && isAuthenticated" @click="handleLogout" class="btn btn-secondary text-sm whitespace-nowrap">
                <Icon name="mdi:logout" class="mr-2" />
                {{ $t('auth.logout') }}
              </button>
            </slot>
          </div>
          
          <!-- Mobile: Burger menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            :aria-label="$t('common.menu')"
          >
            <Icon :name="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl text-gray-700" />
          </button>
        </div>
      </div>
      
      <!-- Mobile menu dropdown -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-col gap-2">
            <!-- Navigation links mobile -->
            <nav class="flex flex-col gap-1 pb-2 border-b border-gray-200">
              <NuxtLink
                to="/recipes"
                class="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/recipes') }"
                @click="mobileMenuOpen = false"
              >
                {{ $t('dashboard.recipes') }}
              </NuxtLink>
              <NuxtLink
                to="/meal-plans"
                class="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/meal-plans') }"
                @click="mobileMenuOpen = false"
              >
                {{ $t('dashboard.mealPlans') }}
              </NuxtLink>
              <NuxtLink
                to="/shopping-lists"
                class="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/shopping-lists') }"
                @click="mobileMenuOpen = false"
              >
                {{ $t('dashboard.shoppingLists') }}
              </NuxtLink>
              <NuxtLink
                to="/history"
                class="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/history') }"
                @click="mobileMenuOpen = false"
              >
                {{ $t('history.title') }}
              </NuxtLink>
              <NuxtLink
                to="/favorites"
                class="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.startsWith('/favorites') }"
                @click="mobileMenuOpen = false"
              >
                {{ $t('favorites.title') }}
              </NuxtLink>
            </nav>
            <div class="pb-2 border-b border-gray-200">
              <LanguageSwitcher />
            </div>
            <div class="flex flex-col gap-2 [&_.btn]:w-full [&_.btn]:text-left [&_.btn]:justify-start">
              <slot name="actions">
                <button v-if="showLogout && isAuthenticated" @click="handleLogout" class="btn btn-secondary text-sm">
                  <Icon name="mdi:logout" class="mr-2" />
                  {{ $t('auth.logout') }}
                </button>
              </slot>
            </div>
          </div>
        </div>
      </Transition>
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

const { logout, isAuthenticated } = useAuth()
const mobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const handleLogout = () => {
  logout()
  mobileMenuOpen.value = false
}

// Close mobile menu when clicking outside
useClickOutside(headerRef, () => {
  mobileMenuOpen.value = false
})

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

