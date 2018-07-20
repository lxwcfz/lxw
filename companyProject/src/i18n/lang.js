import enUS from './en-US.json'
import zhCN from './zh-CN.json'
import jaJP from './ja-JP.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import jaLocale from 'element-ui/lib/locale/lang/ja'
export const LANGS = {
    'en-us': Object.assign(enUS, enLocale),
    'zh-cn': Object.assign(zhCN, zhLocale),
    'ja': Object.assign(jaJP, jaLocale)
}