<template>
  <div class="container">
    <AppHeader />
    <main class="container__main">
      <SectionCard :title="`Horse List (${horses.length})`">
        <HorseListSection />
      </SectionCard>
      <SectionCard title="Current Race">
        <CurrentRaceSection />
      </SectionCard>
      <SectionCard title="Race Program">
        <RaceProgramSection />
      </SectionCard>
      <SectionCard title="Results">
        <ResultsSection />
      </SectionCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Components
import AppHeader from '@/components/Header/AppHeader.component.vue'
import SectionCard from '@/components/Cards/SectionCard.component.vue'
import HorseListSection from '@/components/Sections/HorseListSection.component.vue'
import RaceProgramSection from '@/components/Sections/RaceProgramSection.component.vue'
import CurrentRaceSection from '@/components/Sections/CurrentRaceSection.component.vue'
import ResultsSection from '@/components/Sections/ResultsSection.component.vue'

// Stores
import { useHorseStore } from '@/stores/horse.store'

const horseStore = useHorseStore()

const { horses } = storeToRefs(horseStore)
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
