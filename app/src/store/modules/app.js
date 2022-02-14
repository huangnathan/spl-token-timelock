import storage from 'store'
import { loadLanguageAsync } from '@/locales'
import { APP_LANGUAGE, LANGUAGE_EN_US } from '@/store/mutation-types'

const app = {
    state: {
        isMobile: /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent),
        lang: storage.get(APP_LANGUAGE, LANGUAGE_EN_US)
    },
    mutations: {
        SET_IS_MOBILE: (state, isMobile) => {
            state.isMobile = isMobile
        },
        SET_APP_LANGUAGE: (state, lang) => {
            state.lang = lang
            storage.set(APP_LANGUAGE, lang)
        }
    },
    actions: {
        setLang ({ commit }, lang) {
            return new Promise((resolve, reject) => {
                commit('SET_APP_LANGUAGE', lang)
                loadLanguageAsync(lang).then(() => {
                    resolve()
                }).catch((e) => {
                    reject(e)
                })
            })
        }
    }
}

export default app
