import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Locale } from 'vant';
import { cookieDomain, defaultLanguage } from '@/api/contract';
import messages from './lang';
import Cookies from 'js-cookie';

Vue.use(VueI18n);


let initLang = '';

const ckLang='en-US'




if (['en-US', 'zh-CN'].includes(ckLang)) {
  initLang = ckLang;
} else {
  initLang = defaultLanguage; 
  localStorage.setItem('lang', initLang);
  Cookies.set('lang', initLang, {
    expires: 100,
    path: '/',
    domain: cookieDomain,
  })
}

document.documentElement.lang = initLang;


Locale.use(initLang, messages[initLang]);
const i18n = new VueI18n({
  locale: initLang, 
  messages,
});

export default i18n;
