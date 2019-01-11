import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import axios from 'axios';
import * as config from '@/shared/config/config';
import ResetPassword from '@/account/reset-password/reset-password.vue';
import ResetPasswordClass from '@/account/reset-password/reset-password.component';
import { EMAIL_NOT_FOUND_TYPE } from '@/constants';

const localVue = createLocalVue();
const mockedAxios: any = axios;

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

describe('Reset Component', () => {
  let wrapper: Wrapper<ResetPasswordClass>;
  let resetPassword: ResetPasswordClass;

  beforeEach(() => {
    mockedAxios.post.mockReset();
    wrapper = shallowMount<ResetPasswordClass>(ResetPassword, {
      i18n,
      localVue
    });
    resetPassword = wrapper.vm;
  });

  it('should be a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should reset request be a success', async () => {
    // Given
    mockedAxios.post.mockReturnValue(Promise.resolve());

    // When
    await resetPassword.requestReset();

    // Then
    expect(resetPassword.success).toBeTruthy();
  });

  it('should reset request fail as an error', async () => {
    // Given
    mockedAxios.post.mockReturnValue(
      Promise.reject({
        response: {
          status: null,
          data: {
            type: null
          }
        }
      })
    );

    // When
    resetPassword.requestReset();
    await resetPassword.$nextTick();

    // Then
    expect(resetPassword.success).toBeNull();
    expect(resetPassword.error).toEqual('ERROR');
  });

  it('should reset request fail as an email not existing error', async () => {
    // Given
    mockedAxios.post.mockReturnValue(
      Promise.reject({
        response: {
          status: 400,
          data: {
            type: EMAIL_NOT_FOUND_TYPE
          }
        }
      })
    );

    // When
    resetPassword.requestReset();
    await resetPassword.$nextTick();

    // Then
    expect(resetPassword.success).toBeNull();
    expect(resetPassword.errorEmailNotExists).toEqual('ERROR');
  });
});
