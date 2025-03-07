<script setup>
const { data: posts } = await useAsyncData('notion-posts', () => {
  return queryCollection('notion')
    .select('id', 'title', 'description', 'postedDate', 'url')
    .order('postedDate', 'DESC')
    .all();
});
</script>

<template>
  <div class="mt-8">
    <div v-if="!posts" class="text-center text-gray-600 dark:text-gray-400">
      Loading posts...
    </div>
    
    <div v-else-if="posts.length === 0" class="text-center text-gray-600 dark:text-gray-400">
      No posts found.
    </div>

    <div v-else class="space-y-1">
      <article 
        v-for="post in posts" 
        :key="post._id" 
        class="post-card group border-b border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
      >
        <NuxtLink :to="`/writing/${post.id.replace(/^notion\/|\.md$/g, '')}`" class="block px-3 no-underline -mt-2">
          <h2 class="text-xl font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500">
            {{ post.title }}
          </h2>
          <time class="block text-xs text-gray-500 dark:text-gray-400 tabular-nums -mt-3.5 italic flex items-center">
            <Icon name="i-lucide-calendar" class="mr-1" />
            {{ new Date(post.postedDate).toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) }}
          </time>
          <p class="text-sm text-gray-500 dark:text-gray-300 line-clamp-1 mt-1">
            {{ post.description }}
          </p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<style scoped>
.post-card a {
  text-decoration: none;
}
</style> 