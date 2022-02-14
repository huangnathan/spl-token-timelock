import store from '@/store'
import storage from 'store'
import { APP_LANGUAGE } from '@/store/mutation-types'

export default function Initializer () {
  store.dispatch('setLang', storage.get(APP_LANGUAGE, 'en-US')).then(() => { })
}
