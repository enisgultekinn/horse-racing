<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :color="color"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-check-icon lucide-check"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  color?: string
  strokeWidth?: number
}

const { size = 24, color = 'currentColor', strokeWidth = 2 } = defineProps<Props>()
</script>
