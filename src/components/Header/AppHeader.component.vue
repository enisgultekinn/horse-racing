<template>
  <header class="app-header">
    <div class="app-header__brand">
      <img src="@/assets/images/logo.svg" alt="Horse Racing" class="app-header__logo" />
      <h1 class="app-header__title">Horse Racing</h1>
    </div>

    <AppButton variant="primary" size="md">Generate Race</AppButton>
  </header>
</template>

<script setup lang="ts">
import AppButton from '@/components/Button/AppButton.component.vue'
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins.scss' as *;

.app-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;

  &__brand {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    @include respond-to(md) {
      gap: 0.5rem;
    }
  }

  &__logo {
    width: 48px;
    height: 48px;

    @include respond-to(md) {
      width: 24px;
      height: 24px;
    }
  }

  &__title {
    font-weight: 700;
    font-size: var(--text-xl);

    @include respond-to(md) {
      font-size: var(--text-base);
    }
  }
}
</style>
