<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <div v-if="loading" class="card text-center">
        <p class="text-gray-600">{{ $t('admin.deleteAccount.loading') }}</p>
      </div>

      <div v-else-if="error" class="card">
        <div class="text-center">
          <Icon name="mdi:alert-circle" class="text-6xl text-red-500 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('admin.deleteAccount.error') }}</h1>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <NuxtLink to="/" class="btn btn-primary">
            {{ $t('admin.deleteAccount.backToHome') }}
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="success" class="card">
        <div class="text-center">
          <Icon name="mdi:check-circle" class="text-6xl text-green-500 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('admin.deleteAccount.success') }}</h1>
          <p class="text-gray-600 mb-6">{{ $t('admin.deleteAccount.successMessage') }}</p>
          <NuxtLink to="/" class="btn btn-primary">
            {{ $t('admin.deleteAccount.backToHome') }}
          </NuxtLink>
        </div>
      </div>

      <div v-else class="card">
        <div class="text-center mb-6">
          <Icon name="mdi:alert" class="text-6xl text-red-500 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('admin.deleteAccount.title') }}</h1>
          <p class="text-gray-600 mb-6">{{ $t('admin.deleteAccount.warning') }}</p>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800 font-semibold mb-2">{{ $t('admin.deleteAccount.confirmTitle') }}</p>
          <p class="text-red-700 text-sm">{{ $t('admin.deleteAccount.confirmMessage') }}</p>
        </div>

        <div class="flex gap-4 justify-center">
          <button
            @click="deleteAccount"
            :disabled="deleting"
            class="btn btn-danger"
          >
            <Icon name="mdi:delete" class="mr-2" />
            {{ deleting ? $t('admin.deleteAccount.deleting') : $t('admin.deleteAccount.confirmButton') }}
          </button>
          <NuxtLink to="/" class="btn btn-secondary">
            {{ $t('admin.deleteAccount.cancel') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const success = ref(false)
const deleting = ref(false)

const userId = route.params.userId as string
const token = route.params.token as string

const deleteAccount = async () => {
  if (!confirm(t('admin.deleteAccount.finalConfirm'))) {
    return
  }

  deleting.value = true
  try {
    await api.delete(`/users/delete/${userId}/${token}`)
    success.value = true
  } catch (e: any) {
    error.value = e.message || t('admin.deleteAccount.deleteError')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  // Just load the page, deletion happens on button click
  loading.value = false
})

definePageMeta({
  layout: false,
})
</script>

