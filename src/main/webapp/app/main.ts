// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.common with an alias.
import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './app.vue';
import router from './router';
import * as config from './shared/config/config';
import * as bootstrapVueConfig from './shared/config/config-bootstrap-vue';
import JhiItemCountComponent from './shared/jhi-item-count.vue';
import ActivateService from './account/activate/activate.service';
import AuditsService from './admin/audits/audits.service';
import HealthService from './admin/health/health.service';
import LoginModalService from './account/login-modal.service';
import MetricsService from './admin/metrics/metrics.service';
import RegisterService from './account/register/register.service';
import LogsService from './admin/logs/logs.service';
import Principal from './account/principal';

import '../content/scss/vendor.scss';
import AlertService from '@/shared/alert/alert.service';
import TranslationService from '@/locale/translation.service';
import UserManagementService from '@/admin/user-management/user-management.service';
import ConfigurationService from '@/admin/configuration/configuration.service';

// jhipster-needle-add-entity-service-to-main-import - JHipster will import entities services here

Vue.config.productionTip = false;

const i18n = config.initI18N(Vue);
const store = config.initVueXStore(Vue);

const alertService = new AlertService(store);
const translationService = new TranslationService(store);
config.initVueApp(Vue);
config.initFortAwesome(Vue);
bootstrapVueConfig.initBootstrapVue(Vue);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('jhi-item-count', JhiItemCountComponent);

const activateService = new ActivateService();
const auditsService = new AuditsService();
const healthService = new HealthService();
const loginModalService = new LoginModalService();
const metricsService = new MetricsService();
const registerService = new RegisterService();
const userManagementService = new UserManagementService();
const configurationService = new ConfigurationService();
const logsService = new LogsService();

const principal = new Principal(store, translationService, i18n, router);

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/not-found');
  }
  next();
});

// jhipster-needle-add-entity-service-to-main-declaration - JHipster will declare entities services here

/* tslint:disable */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  provide: {
    activateService: () => activateService,
    auditsService: () => auditsService,
    healthService: () => healthService,
    loginModalService: () => loginModalService,

    configurationService: () => configurationService,
    logsService: () => logsService,
    metricsService: () => metricsService,
    principal: () => principal,
    registerService: () => registerService,
    alertService: () => alertService,
    translationService: () => translationService,
    userService: () => userManagementService

    // jhipster-needle-add-entity-service-to-main - JHipster will import entities services here
  },
  i18n,
  store
});
