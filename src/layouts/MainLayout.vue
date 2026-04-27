<template>
  <div class="container">
    <AppHeader />
    <main class="container__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Components
import AppHeader from '@/components/Header/AppHeader.component.vue'
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;
.container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100vh;
  max-height: 100vh;

  @include respond-to(md) {
    height: auto;
    max-height: none;
  }

  &__main {
    display: grid;
    grid-template-columns: 0.75fr 2fr 0.75fr 0.75fr;
    gap: 1rem;
    margin-top: 1rem;
    flex: 1;
    min-height: 0;

    @include respond-to(md) {
      grid-template-columns: 1fr;
      grid-template-rows: none;
    }
  }
}
</style>
