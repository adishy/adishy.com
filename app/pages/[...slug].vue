<script setup lang="ts">
/**
 * Simple page component that renders notion pages based on their layout
 */
import type { LayoutKey } from '#build/types/layouts'

const route = useRoute()

const { data: page } = await useAsyncData(`notion-${route.params.slug}`, () => {
  // Handle root page
  if (!route.params.slug || route.params.slug.length === 0) {
    return queryCollection('notion')
      .where('section', '=', 'Nav')
      .order('postedDate', 'ASC')
      .first()
  }
  
  // Join slug parts to match pageSlug format
  const slug = Array.isArray(route.params.slug) 
    ? route.params.slug.join('/')
    : route.params.slug

  return queryCollection('notion')
    .where('pageSlug', '=', slug)
    .first()
})

// Get layout from page or default
const layout = computed<LayoutKey>(() => 
  (page.value?.layout as LayoutKey) || 'default'
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description
})
</script>

<template>
  <NuxtLayout 
    :name="layout"
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
