<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('content'),
);

const appConfig = useAppConfig();
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-4xl">
    <!-- Navigation -->
    <div class="text-gray-700 dark:text-gray-200">
      <NuxtLink
        v-for="link in navigation"
        :key="link.path" class="mr-6"
        :to="link.path"
        active-class="font-bold"
      >{{ link.title }}</NuxtLink>
    </div>
    <div>
      <ColorModeSwitch class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300" />
    </div>
  </div>
</template>
