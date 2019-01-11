import Component from 'vue-class-component';
import { Vue } from 'vue-property-decorator';

@Component
export default class Error extends Vue {
  errorMessage: string = null;
  error403 = false;
  error404 = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      let errorMessage = null;
      let error403 = false;
      let error404 = false;

      if (to.meta.errorMessage) {
        errorMessage = to.meta.errorMessage;
      }

      if (to.meta.error403) {
        error403 = to.meta.error403;
      }

      if (to.meta.error404) {
        error404 = to.meta.error404;
      }

      vm.init(errorMessage, error403);
    });
  }

  public init(errorMessage: string = null, error403 = false) {
    this.errorMessage = errorMessage;
    this.error403 = error403;
  }
}
