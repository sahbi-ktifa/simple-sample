import axios from 'axios';
import VueI18n from 'vue-i18n';
import { Store } from 'vuex';

export default class TranslationService {
  private store: Store<{}>;

  constructor(store: Store<{}>) {
    this.store = store;
  }

  public refreshTranslation(i18n: VueI18n, newLanguage: string) {
    let currentLanguage = this.store.getters.currentLanguage;
    currentLanguage = newLanguage ? newLanguage : 'en';
    if (i18n && !i18n.messages[currentLanguage]) {
      i18n.setLocaleMessage(currentLanguage, {});
      axios.get('i18n/' + currentLanguage + '.json').then(res => {
        if (res.data) {
          i18n.setLocaleMessage(currentLanguage, res.data);
          i18n.locale = currentLanguage;
          this.store.commit('currentLanguage', currentLanguage);
        }
      });
    } else if (i18n) {
      i18n.locale = currentLanguage;
      this.store.commit('currentLanguage', currentLanguage);
    }
  }
}
