import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import * as config from '@/shared/config/config';
import UserManagement from '@/admin/user-management/user-management.vue';
import UserManagementClass from '@/admin/user-management/user-management.component';
import UserManagementService from '@/admin/user-management/user-management.service';
import Principal from '@/account/principal';
import router from '@/router';
import TranslationService from '@/locale/translation.service';

const localVue = createLocalVue();
const mockedAxios: any = axios;

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', FontAwesomeIcon);
localVue.component('router-link', {});
localVue.directive('b-modal', {});

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('UserManagement Component', () => {
  let wrapper: Wrapper<UserManagementClass>;
  let userManagement: UserManagementClass;

  const account = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@jhipster.org'
  };

  beforeEach(() => {
    mockedAxios.put.mockReset();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockReturnValue(Promise.resolve({ headers: {} }));

    store.commit('authenticated', account);
    wrapper = shallowMount<UserManagementClass>(UserManagement, {
      store,
      i18n,
      localVue,
      stubs: {
        bPagination: true,
        jhiItemCount: true,
        bModal: true
      },
      provide: {
        principal: () => new Principal(store, new TranslationService(store), i18n, router),
        userService: () => new UserManagementService()
      }
    });
    userManagement = wrapper.vm;
  });

  it('should be a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe('OnInit', () => {
    it('Should call load all on init', async () => {
      // WHEN
      userManagement.loadAll();
      await userManagement.$nextTick();

      // THEN
      expect(mockedAxios.get).toHaveBeenCalledWith(`api/users?sort=id,desc&page=0&size=20`);
    });
  });

  describe('setActive', () => {
    it('Should update user and call load all', async () => {
      // GIVEN
      mockedAxios.put.mockReturnValue(Promise.resolve({}));

      // WHEN
      userManagement.setActive({ id: 'test' }, true);
      await userManagement.$nextTick();

      // THEN
      expect(mockedAxios.put).toHaveBeenCalledWith(`api/users`, { id: 'test', activated: true });
      expect(mockedAxios.get).toHaveBeenCalledWith(`api/users?sort=id,desc&page=0&size=20`);
    });
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      mockedAxios.delete.mockReturnValue(Promise.resolve({}));

      // WHEN
      userManagement.prepareRemove({ login: 'test' });
      userManagement.deleteUser();
      await userManagement.$nextTick();

      // THEN
      expect(mockedAxios.delete).toHaveBeenCalledWith(`api/users/test`);
      expect(mockedAxios.get).toHaveBeenCalledWith(`api/users?sort=id,desc&page=0&size=20`);
    });
  });

  describe('change order', () => {
    it('should change order and invert reverse', () => {
      // WHEN
      userManagement.changeOrder('dummy-order');

      // THEN
      expect(userManagement.propOrder).toEqual('dummy-order');
      expect(userManagement.reverse).toBe(true);
    });
  });
});
