<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Notion Content Debug</h1>
    
    <div class="mb-4">
      <button 
        @click="fetchContent" 
        class="bg-blue-500 text-white px-4 py-2 rounded"
        :disabled="loading"
      >
        Fetch Notion Content
      </button>
    </div>

    <div v-if="loading" class="my-4">
      Loading...
    </div>

    <div v-if="error" class="my-4 p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div v-if="content" class="my-4">
      <h2 class="text-xl font-bold mb-2">Content Found:</h2>
      <pre class="bg-gray-100 p-4 rounded overflow-auto">
        {{ JSON.stringify(content, null, 2) }}
      </pre>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const loading = ref(false)
const error = ref(null)
const { content } = await useAsyncData(route.path, async () => {
    loading.value = true
    console.log('Fetching content for route:', route.path)
    const collection = queryCollection('hackernews');
    const items = await collection.all();
    console.log(items);
    loading.value = false
    return items;
})
</script> 