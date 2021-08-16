
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import enUsLocale from './en';
import zhCnLocale from './cn';

export default {
  'zh-CN': {
    ...zhCN,
    ...zhCnLocale,
  },
  'en-US': {
    ...enUS,
    ...enUsLocale,
  },
};
