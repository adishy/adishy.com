<script lang="ts" setup>
const { data: posts } = await useAsyncData(() => {
  return queryCollection('notion')
    .select('id', 'object', 'created_time', 'url')
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
        <strong>{{ post.url }}</strong>
      </nuxt-link>
    </p>
  </div>
</template>