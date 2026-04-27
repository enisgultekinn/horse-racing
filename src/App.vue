<template>
  <MainLayout>
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
  </MainLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
//layouts
import MainLayout from './layouts/MainLayout.vue'

//components
import SectionCard from '@/components/Cards/SectionCard.component.vue'
import HorseListSection from '@/components/Sections/HorseListSection.component.vue'
import CurrentRaceSection from '@/components/Sections/CurrentRaceSection.component.vue'
import RaceProgramSection from '@/components/Sections/RaceProgramSection.component.vue'
import ResultsSection from '@/components/Sections/ResultsSection.component.vue'

//stores
import { useHorseStore } from '@/stores/horse.store'

const horseStore = useHorseStore()
const { horses } = storeToRefs(horseStore)
</script>
