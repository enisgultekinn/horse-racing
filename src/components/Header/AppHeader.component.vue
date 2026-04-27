<template>
  <header class="app-header">
    <div class="app-header__brand">
      <img :src="logoUrl" :alt="t('app.title')" class="app-header__logo" />
      <h1 class="app-header__title">Horse Racing</h1>
    </div>

    <div class="app-header__actions">
      <AppButton variant="primary" size="md" :disabled="isRunning" @click="generateRace">
        {{ t('header.generateRace') }}
      </AppButton>
      <AppSelect v-model="localeStore.locale" :options="localeOptions" size="md" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

//assets
import logoUrl from '@/assets/images/logo.svg'

//components
import AppButton from '@/components/Button/AppButton.component.vue'
import AppSelect from '@/components/Select/AppSelect.component.vue'

//stores
import { useRaceStore } from '@/stores/race.store'
import { useLocaleStore } from '@/stores/locale.store'

const { t } = useI18n()

const raceStore = useRaceStore()
const localeStore = useLocaleStore()
const { localeOptions } = storeToRefs(localeStore)
const { isRunning } = storeToRefs(raceStore)

function generateRace() {
  raceStore.generateRace()
}
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

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

  &__actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;

    @include respond-to(md) {
      gap: 0.5rem;
      flex-direction: column-reverse;
    }
  }
}
</style>
