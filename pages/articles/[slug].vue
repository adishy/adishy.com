<template>
  <div>
    <h1>{{ article.title }}</h1>
    <nuxt-content :document="article" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: null // Initialize article as null
    };
  },
  async asyncData({ $content, params }) {
    console.log('Fetching article:', params.slug);
    const article = await $content(params.slug).fetch();
    console.log('Fetched article:', article);
    this.article = article;
    return { article };
  }
}
</script> 