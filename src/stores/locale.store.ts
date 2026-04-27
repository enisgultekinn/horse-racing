import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { i18n, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'locale'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<SupportedLocale>(i18n.global.locale.value as SupportedLocale)
  const { t } = useI18n()

  const localeOptions = computed(() =>
    SUPPORTED_LOCALES.map((code) => ({
      value: code,
      label: t(`language.${code}`),
    })),
  )

  watch(locale, (next) => {
    i18n.global.locale.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.setAttribute('lang', next)
    }
  })

  function setLocale(next: SupportedLocale) {
    locale.value = next
  }

  return { locale, setLocale, localeOptions }
})
