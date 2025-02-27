<script setup>
const { data: posts } = await useAsyncData('posts', () => {
    return queryCollection('notion').all()
})
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold mb-8">Writing</h1>
    
    <div class="space-y-8">
      <article v-for="post in posts" :key="post._id" class="border-b pb-8">
        <NuxtLink :to="post.slug" class="group">
          <h2 class="text-2xl font-semibold group-hover:text-blue-500">
            {{ post.title }}
          </h2>
          <time class="text-sm text-gray-500">
            {{ new Date(post.date).toLocaleDateString() }}
          </time>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ post.description }}
          </p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template> 