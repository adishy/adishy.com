<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <div class="socials-container text-gray-800 dark:text-gray-200">
    <a
      v-if="appConfig.socials?.linkedin"
      :href="`https://linkedin.com/in/${appConfig.socials.linkedin}`"
      class="social-button text-gray-800 dark:text-gray-200"
      title="LinkedIn"
    >
      <Icon name="i-simple-icons-linkedin" class="icon" />
      LinkedIn
    </a>
    <a
      v-if="appConfig.socials?.youtube"
      :href="`https://youtube.com/${appConfig.socials.youtube}`"
      class="social-button text-gray-800 dark:text-gray-200"
      title="YouTube"
    >
      <Icon name="i-simple-icons-youtube" class="icon" />
      Youtube
    </a>
    <a
      v-if="appConfig.socials?.bluesky"
      :href="`https://bsky.app/profile/${appConfig.socials.bluesky}`"
      class="social-button text-gray-800 dark:text-gray-200"
      title="Bluesky"
    >
      <Icon name="i-simple-icons-bluesky" class="icon" />
      Bluesky
    </a>
    <a
      v-if="appConfig.socials?.github"
      :href="`https://github.com/${appConfig.socials.github}`"
      class="social-button text-gray-800 dark:text-gray-200"
      title="GitHub"
    >
      <Icon name="i-simple-icons-github" class="icon" />
      Github
    </a>
    <span v-if="appConfig.socials?.location" class="social-button">
      <Icon name="i-lucide-map" class="icon" />
      
      {{ appConfig.socials.location }}
    </span>
  </div>
</template>

<style scoped>
.socials-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
}

.socials-container a {
  text-decoration: none;
  color: inherit;
}
  
.social-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid #444;
  transition: background-color 0.3s ease, transform 0.3s ease;
  color: inherit;
}

.icon {
  margin-right: 8px;
}

.social-button:hover {
  background: linear-gradient(45deg, #6a0dad, #b19cd9);
  transform: translateY(-2px);
}
</style>
