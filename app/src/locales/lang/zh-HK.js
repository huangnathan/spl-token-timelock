import global from './zh-HK/global'

import home from './zh-HK/home'
import invest from './zh-HK/invest'
import zhTw from 'element-plus/lib/locale/lang/zh-tw'

const components = {
  elLocale: zhTw
}

export default {
  ...components,
  ...global,
  ...home,
  ...invest
}
