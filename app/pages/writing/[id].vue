<script setup>
const route = useRoute()

definePageMeta({
  layout: 'default'
})

const { data: post } = await useAsyncData(`post-${route.params.id}`, () => {
  return queryCollection('notion')
    .where('id', '=', route.params.id)
    .select('id', 'title', 'description', 'date', 'url', 'body')
    .first()
})

console.log('Post:', post.value) // Debug log

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
    <div class="px-4 py-10 m-auto sm:px-8 sm:rounded-lg max-w-4xl">
      <article v-if="post" class="prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 max-w-none">
        <h1 class="text-3xl text-center text-gray-800 dark:text-gray-200">
          {{ post.title }}
        </h1>
        
        <div class="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-4 mb-8">
          <time>{{ new Date(post.date).toLocaleDateString() }}</time>
          <a 
            v-if="post.url" 
            :href="post.url" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="hover:text-blue-500"
          >
            View on Notion
          </a>
        </div>

        <div v-html="post.body" />
      </article>

      <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink 
          to="/writing" 
          class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
        >
          ← Back to Writing
        </NuxtLink>
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