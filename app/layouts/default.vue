<template>
  <div class="px-4 py-10 m-auto sm:px-8 sm:rounded-lg max-w-4xl sm:shadow">
    <main class="max-w-none flex justify-center items-center">
      <slot>
        <h1 class="text-2xl">Page not found</h1>
      </slot>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
