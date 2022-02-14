import { mapState } from 'vuex'
import store from '@/store'

const i18nMixin = {
  computed: {
    ...mapState({
      currentLang: state => state.app.lang
    })
  },
  methods: {
    async setLang (lang) {
      await store.dispatch('setLang', lang)
    }
  }
}

export default i18nMixin
