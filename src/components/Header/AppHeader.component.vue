<template>
  <header class="header-container">
    <div class="header-container__logo-container">
      <img
        src="../../assets/images/logo.svg"
        alt="Horse Racing"
        class="header-container__logo-container__logo"
      />
      <h1 class="header-container__logo-container__title">Horse Racing</h1>
    </div>

    <AppButton variant="secondary" size="md">Generate Race</AppButton>
  </header>
</template>

<script setup lang="ts">
import AppButton from '@/components/Button/AppButton.component.vue'
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins.scss' as *;
.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;

  &__logo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    &__logo {
      width: 48px;
      height: 48px;
    }

    &__title {
      font-weight: 600;
      font-size: var(--text-xl);
    }
  }

  @include respond-to(md) {
    &__logo-container {
      gap: 0.5rem;
      &__logo {
        width: 24px;
        height: 24px;
      }
      &__title {
        font-size: var(--text-base);
      }
    }
  }
}
</style>
