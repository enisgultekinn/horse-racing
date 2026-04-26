<template>
  <p class="empty-list">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
const { message = 'No data' } = defineProps<{
  message?: string
}>()
</script>

<style scoped lang="scss">
.empty-list {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  font-weight: 500;
}
</style>
