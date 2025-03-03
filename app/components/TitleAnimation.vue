<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  delay: {
    type: String,
    default: "100"
  }
})

// Split text into array of letters, preserving spaces
const letters = props.text.split('').map((letter, index) => ({
  letter: letter === ' ' ? '\u00A0' : letter, // Use non-breaking space for spaces
  isSpace: letter === ' ',
  style: {
    animationDelay: `${index * parseInt(props.delay)}ms`,
    '--index': index
  }
}))

// Preload Inter font
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap'
    }
  ]
})
</script>

<template>
  <div class="relative flex justify-center items-center w-full">
    <h1 class="relative z-10 font-bold tracking-normal leading-normal font-['Inter'] title-responsive">
      <span 
        v-for="({ letter, isSpace, style }, index) in letters" 
        :key="index"
        :style="style"
        :class="[
          'inline-block relative align-bottom',
          isSpace ? 'w-[0.3em]' : 'opacity-0 aurora-letter'
        ]"
      >
        {{ letter }}
      </span>
    </h1>
    <div class="absolute inset-0 z-0 aurora-blur"></div>
  </div>
</template>

<style scoped>
/* Add responsive title class */
.title-responsive {
  /* clamp(minimum, preferred, maximum) */
  min-width: 305px;
  font-size: clamp(2rem, min(5vw, 3rem), 3rem);
  width: 100%;
  text-align: center;
  padding-inline: 1rem;
}

.aurora-letter {
  background: linear-gradient(
    145deg,
    #4A90E2,
    #67B8F7,
    #48BB78,
    #63B3ED
  );
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 6px rgba(74, 144, 226, 0.2));
  animation: aurora-reveal 0.8s cubic-bezier(0.17, 0.84, 0.44, 1) forwards,
             aurora-flow 8s ease-in-out infinite;
}

.aurora-letter::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  filter: blur(12px);
  opacity: 0.5;
  animation: aurora-pulse 4s ease-in-out infinite;
}

.aurora-blur {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(74, 144, 226, 0.08),
    rgba(103, 184, 247, 0.08),
    rgba(72, 187, 120, 0.08),
    transparent 60%
  );
  filter: blur(30px);
  animation: aurora-blur 8s ease-in-out infinite;
}

@keyframes aurora-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes aurora-pulse {
  0%, 100% {
    opacity: 0.5;
    filter: blur(12px) brightness(1);
  }
  50% {
    opacity: 0.7;
    filter: blur(16px) brightness(1.1);
  }
}

@keyframes aurora-blur {
  0%, 100% {
    transform: translate(-3%, -3%) scale(1);
  }
  50% {
    transform: translate(3%, 3%) scale(1.05);
  }
}

@keyframes aurora-flow {
  0%, 100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 6px rgba(74, 144, 226, 0.2));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 8px rgba(72, 187, 120, 0.2));
  }
}

/* Dark mode enhancements */
:root.dark .aurora-letter {
  filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.3));
}

:root.dark .aurora-blur {
  opacity: 0.2;
}
</style> 