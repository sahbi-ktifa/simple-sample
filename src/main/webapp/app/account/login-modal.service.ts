import Vue from 'vue';

export default class LoginModalService {
  public openLogin(instance: Vue): void {
    instance.$emit('bv::show::modal', 'login-page');
  }
}
