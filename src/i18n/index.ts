import { createI18n } from 'vue-i18n'
import zhCommon from './languages/zh-CN/common'
import enCommon from './languages/en-US/common'

const messages = {
  'zh-CN': { common: zhCommon },
  'en-US': { common: enCommon },
}

const savedLang = localStorage.getItem('lang') || 'zh-CN'

const i18n = createI18n({
  locale: savedLang,
  fallbackLocale: 'zh-CN',
  messages,
})

export function setLanguage(lang: string) {
  i18n.global.locale = lang as 'zh-CN' | 'en-US'
  localStorage.setItem('lang', lang)
}

export default i18n