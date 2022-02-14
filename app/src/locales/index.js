import { createI18n } from 'vue-i18n'
import storage from 'store'
import enUS from './lang/en-US'
import zhHK from './lang/zh-HK'
import { APP_LANGUAGE, LANGUAGE_EN_US, LANGUAGE_ZH_HK } from '@/store/mutation-types'
import { app } from '../main'
import ElementPlus from 'element-plus'
import elEnUs from 'element-plus/es/locale/lang/en'
import elZhTw from 'element-plus/lib/locale/lang/zh-tw'

const lang = navigator.language || navigator.userLanguage
const langPrefix = lang ? lang.substr(0, 2) : ''
const isZh = langPrefix.toLowerCase() === 'zh'

export const defaultLang = isZh ? LANGUAGE_ZH_HK : LANGUAGE_EN_US

const messages = {
  'en-US': {
    ...enUS,
    ...elEnUs
  },
  'zh-HK': {
    ...zhHK,
    ...elZhTw
  }
}

const i18n = createI18n({
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

const loadedLanguages = [defaultLang]

function setI18nLanguage (lang) {
  i18n.locale = lang
  i18n.global.locale = lang
  // axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

function elLocales (lang) {
  if (lang === 'en-US') {
    app.use(ElementPlus, {
      locale: elEnUs
    })
  } else if (lang === 'zh-HK') {
    app.use(ElementPlus, {
      locale: elZhTw
    })
  }
}

export function loadLanguageAsync (lang = defaultLang) {
  return new Promise(resolve => {
    storage.set(APP_LANGUAGE, lang)
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(`./lang/${lang}.js`).then(msg => {
          // const locale = msg.default
          // i18n.setLocaleMessage(lang, locale)
          loadedLanguages.push(lang)
          return setI18nLanguage(lang)
        })
      }
      elLocales(lang)
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  })
}

export default i18n
