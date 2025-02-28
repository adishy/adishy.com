<script lang="ts" setup>
const { data: posts } = await useAsyncData(() => {
  return queryCollection('notion')
    .select('id', 'title', 'description', 'date', 'url')
    .all()
})
</script>

<template>
  <div>
    <h1>Blog</h1>
    <p
      v-for="post in posts"
      :key="post.id"
    >
      >
      <nuxt-link :to="post.url">
        <strong>{{ post.title }}</strong> 
        <span>{{ post.date }}</span>
        {{ post.description }}
      </nuxt-link>
    </p>
  </div>
</template>