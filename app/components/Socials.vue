<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <div class="socials-container text-gray-800 dark:text-gray-200">

    <!-- LinkedIn -->
    <a
      v-if="appConfig.socials?.linkedin"
      :href="`https://linkedin.com/in/${appConfig.socials.linkedin}`"
      class="social-button text-sm text-gray-800 dark:text-gray-200"
      title="LinkedIn"
    >
      <Icon name="i-simple-icons-linkedin" class="icon" />
      LinkedIn
    </a>

    <!-- YouTube -->
    <a
      v-if="appConfig.socials?.youtube"
      :href="`https://youtube.com/${appConfig.socials.youtube}`"
      class="social-button text-sm text-gray-800 dark:text-gray-200"
      title="YouTube"
    >
      <Icon name="i-simple-icons-youtube" class="icon" />
      Youtube
    </a>

    <!-- Bluesky -->
    <a
      v-if="appConfig.socials?.bluesky"
      :href="`https://bsky.app/profile/${appConfig.socials.bluesky}`"
      class="social-button text-sm text-gray-800 dark:text-gray-200"
      title="Bluesky"
    >
      <Icon name="i-simple-icons-bluesky" class="icon" />
      Bluesky
    </a>

    <!-- GitHub -->
    <a
      v-if="appConfig.socials?.github"
      :href="`https://github.com/${appConfig.socials.github}`"
      class="social-button text-sm text-gray-800 dark:text-gray-200"
      title="GitHub"
    >
      <Icon name="i-simple-icons-github" class="icon" />
      Github
    </a>

    <!-- Email -->
    <a
      v-if="appConfig.socials?.email"
      :href="`mailto:${appConfig.socials.email}`"
      class="social-button text-sm text-gray-800 dark:text-gray-200"
      title="Email"
    >
      <Icon name="i-lucide-mail" class="icon" />
      <span>
        Drop me a line - 
        <span class="italic text-blue-300"> {{ appConfig.socials.email }}</span>
      </span>
    </a>

    <!-- Location -->
    <span v-if="appConfig.socials?.location" class="social-button text-sm text-gray-800 dark:text-gray-200">
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
  background: linear-gradient(45deg, var(--color-gray-700, #374151), var(--color-gray-500, #6B7280));
  color: var(--color-gray-100, #F3F4F6);
  transform: translateY(-2px);
}
</style>
