<script setup>
const route = useRoute()

definePageMeta({
  layout: 'posts'
})

// Use the content query helper to get markdown content
const { data: post } = await useAsyncData(`post-${route.params.id}`, async () => {
  console.log("Route", route.params.id)
  return queryCollection('notion')
    .where('pageSlug', '=', `writing/${route.params.id}`)
    .first()
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description
})
</script>

<template>
  <NuxtLayout 
    name="default"
    class="min-h-screen animate-gradient bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 ring-1 ring-gray-200 dark:ring-gray-700"
  >
    <div>
      <NuxtLink to="/writing" class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">← Back</NuxtLink>
      <article v-if="post" class="prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 max-w-none">
        <h1 class="text-3xl text-center text-gray-800 dark:text-gray-200">
          {{ post.title }}
        </h1>
        
        <div class="flex justify-center items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-8">
          <time class="flex items-center">
            <Icon name="i-lucide-calendar" class="mr-1" />
            {{ new Date(post.postedDate).toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) }}
          </time>
        </div>

        <!-- Use ContentDoc to render the markdown content -->
        <ContentRenderer :value="post" />
      </article>
      <div v-if="!post">
        <p>Loading...</p>
      </div>
    </div>
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