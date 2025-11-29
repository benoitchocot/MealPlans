<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :show-logout="false" />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {{ $t('legal.privacy.title') }}
        </h1>
        
        <div class="text-sm text-gray-500 mb-8">
          <p>{{ $t('legal.privacy.lastUpdated') }}: {{ lastUpdated }}</p>
        </div>

        <div class="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section1.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.privacy.section1.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section2.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ $t('legal.privacy.section2.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{{ $t('legal.privacy.section2.data1') }}</li>
              <li>{{ $t('legal.privacy.section2.data2') }}</li>
              <li>{{ $t('legal.privacy.section2.data3') }}</li>
              <li>{{ $t('legal.privacy.section2.data4') }}</li>
              <li>{{ $t('legal.privacy.section2.data5') }}</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section3.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ $t('legal.privacy.section3.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{{ $t('legal.privacy.section3.use1') }}</li>
              <li>{{ $t('legal.privacy.section3.use2') }}</li>
              <li>{{ $t('legal.privacy.section3.use3') }}</li>
              <li>{{ $t('legal.privacy.section3.use4') }}</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section4.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.privacy.section4.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section5.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.privacy.section5.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section6.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.privacy.section6.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section7.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.privacy.section7.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.privacy.section8.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ $t('legal.privacy.section8.content') }}
            </p>
            <div v-if="isAuthenticated" class="mt-6 p-6 bg-gray-50 rounded-lg">
              <p class="text-gray-700 mb-4">
                {{ $t('legal.privacy.section8.requestDeletion') }}
              </p>
              <button
                @click="requestAccountDeletion"
                :disabled="deleting"
                class="btn btn-danger"
              >
                <Icon name="mdi:delete" class="mr-2" />
                {{ deleting ? $t('legal.privacy.section8.deleting') : $t('legal.privacy.section8.deleteButton') }}
              </button>
            </div>
            <p v-else class="text-gray-600 italic">
              {{ $t('legal.privacy.section8.loginRequired') }}
            </p>
          </section>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200">
          <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 font-medium">
            ← {{ $t('legal.privacy.backToHome') }}
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const api = useApi()
const { t } = useI18n()
const router = useRouter()

const deleting = ref(false)
const lastUpdated = '27 novembre 2025'

const requestAccountDeletion = async () => {
  if (!confirm(t('legal.privacy.section8.confirmDeletion'))) {
    return
  }

  deleting.value = true
  try {
    await api.post('/users/me/request-deletion')
    alert(t('legal.privacy.section8.deletionRequested'))
    // Ne pas déconnecter l'utilisateur, juste confirmer que la demande a été envoyée
  } catch (e: any) {
    alert(t('legal.privacy.section8.deletionError') + ': ' + (e.message || t('common.error')))
  } finally {
    deleting.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

