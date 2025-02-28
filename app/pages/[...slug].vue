<script setup lang="ts">
/**
 * Document driven is removed in Content v3.
 * This page is a simple/full-feature replacement of document driven.
 */
import type { LayoutKey } from '#build/types/layouts'

const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.params.slug}`, () => {
  return queryCollection('content').path(route.path).first()
})

console.log(page)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

useSeoMeta(page.value?.seo || {})
</script>

<template>
  <NuxtLayout 
    :name="page?.layout as LayoutKey || 'default'" 
    class="min-h-screen animate-gradient bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 ring-1 ring-gray-200 dark:ring-gray-700"
  >
    <ContentRenderer
      v-if="page"
      :value="page"
      class="prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900"
    />
  </NuxtLayout>
</template>

<style>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
</style>
