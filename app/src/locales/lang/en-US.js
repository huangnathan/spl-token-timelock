import global from './en-US/global'

import home from './en-US/home'
import invest from './en-US/invest'
import en from 'element-plus/es/locale/lang/en'

const components = {
  elLocale: en
}

export default {
  ...components,
  ...global,
  ...home,
  ...invest
}
