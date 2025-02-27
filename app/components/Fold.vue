<script setup lang="ts">
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
});

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="fold-container">
    <button 
      @click="toggle" 
      class="fold-header"
      :aria-expanded="isOpen"
    >
      <Icon 
        :name="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" 
        class="fold-icon"
      />
      <slot name="header">{{ title }}</slot>
    </button>
    <Transition name="fold">
      <div v-show="isOpen" class="fold-content">
        <slot name="content"></slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fold-container {
  margin-top: 8px;
  margin-bottom: 8px;
}

.fold-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: inherit;
}

.fold-icon {
  margin-right: 8px;
  transition: transform 0.1s ease;
}

.fold-content {
  padding: 0 16px 16px 40px;
}

/* Transition animations */
.fold-enter-active,
.fold-leave-active {
  transition: all 0.1s ease-out;
  overflow: hidden;
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  max-height: 0;
}

.fold-enter-to,
.fold-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style> 