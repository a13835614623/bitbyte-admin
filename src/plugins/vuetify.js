import Vue from "vue";
import Vuetify from "vuetify/lib";
import { zhHans } from "vuetify/lib/locale";
Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    current: "zhHans",
    locales: { zhHans }
  }
});
