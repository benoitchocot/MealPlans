<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :show-logout="false" />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {{ $t('legal.terms.title') }}
        </h1>
        
        <div class="text-sm text-gray-500 mb-8">
          <p>{{ $t('legal.terms.lastUpdated') }}: {{ lastUpdated }}</p>
        </div>

        <div class="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section1.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section1.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section2.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ $t('legal.terms.section2.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{{ $t('legal.terms.section2.requirement1') }}</li>
              <li>{{ $t('legal.terms.section2.requirement2') }}</li>
              <li>{{ $t('legal.terms.section2.requirement3') }}</li>
              <li>{{ $t('legal.terms.section2.requirement4') }}</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section3.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              {{ $t('legal.terms.section3.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{{ $t('legal.terms.section3.prohibition1') }}</li>
              <li>{{ $t('legal.terms.section3.prohibition2') }}</li>
              <li>{{ $t('legal.terms.section3.prohibition3') }}</li>
              <li>{{ $t('legal.terms.section3.prohibition4') }}</li>
              <li>{{ $t('legal.terms.section3.prohibition5') }}</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section4.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section4.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section5.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section5.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section6.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section6.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section7.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section7.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              {{ $t('legal.terms.section8.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('legal.terms.section8.content') }}
            </p>
          </section>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200">
          <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 font-medium">
            ← {{ $t('legal.terms.backToHome') }}
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = '27 novembre 2025'

definePageMeta({
  layout: false,
})
</script>

