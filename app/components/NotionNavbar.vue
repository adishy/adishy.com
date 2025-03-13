<script setup lang="ts">
const { data: notionNavigation } = await useAsyncData('notion-navigation', () => {
  return queryCollection('notion')
    .where('section', '=', 'Nav')
    .select('pageSlug', 'title', 'notionId', 'postedDate')
    .order('postedDate', 'ASC')
    .all()
})
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-4xl">
    <!-- Navigation -->
    <div class="text-gray-700 dark:text-gray-200">
      <NuxtLink
        v-for="item in notionNavigation"
        :key="item.notionId"
        :to="`/${item.pageSlug}`"
        class="mr-6"
        active-class="font-bold"
      >
        {{ item.title }}
      </NuxtLink>
    </div>
  </div>
</template> 