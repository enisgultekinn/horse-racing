<template>
  <MainLayout>
    <SectionCard :title="t('sections.horseList', { count: horses.length })">
      <HorseListSection />
    </SectionCard>
    <SectionCard :title="t('sections.currentRace')">
      <CurrentRaceSection />
    </SectionCard>
    <SectionCard :title="t('sections.raceProgram')">
      <RaceProgramSection />
    </SectionCard>
    <SectionCard :title="t('sections.results')">
      <ResultsSection />
    </SectionCard>
  </MainLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const horseStore = useHorseStore()
const { horses } = storeToRefs(horseStore)
</script>
