import numeral from 'numeral';
import JhiMetricsModal from './metrics-modal.vue';
import MetricsService from './metrics.service';
import { Component, Vue, Inject } from 'vue-property-decorator';

@Component({
  components: {
    'metrics-modal': JhiMetricsModal
  }
})
export default class JhiMetrics extends Vue {
  public metrics: any = {};
  public cachesStats: any = {};
  public servicesStats: any = {};
  public updatingMetrics = true;
  public JCACHE_KEY = 'jcache.statistics';
  public threads: any = null;
  @Inject('metricsService')
  private metricsService: () => MetricsService;

  public mounted(): void {
    this.refresh();
  }

  public refresh(): void {
    this.updatingMetrics = true;
    this.metricsService()
      .getMetrics()
      .then(res => {
        this.metrics = res.data;
        this.updatingMetrics = false;
        this.servicesStats = {};
        this.cachesStats = {};
        Object.keys(this.metrics.timers).forEach(key => {
          const value = this.metrics.timers[key];
          if (key.includes('web.rest') || key.includes('service')) {
            this.servicesStats[key] = value;
          }
        });
        Object.keys(this.metrics.gauges).forEach(key => {
          if (key.includes('jcache.statistics')) {
            const value = this.metrics.gauges[key].value;
            // remove gets or puts
            const index = key.lastIndexOf('.');
            const newKey = key.substr(0, index);

            // Keep the name of the domain
            this.cachesStats[newKey] = {
              name: this.JCACHE_KEY.length,
              value
            };
          }
        });
      });
  }

  public refreshThreadDumpData(): void {
    if ((<any>this.$refs.metricsModal).show) {
      (<any>this.$refs.metricsModal).show();
    }
    this.metricsService()
      .retrieveThreadDump()
      .then(res => {
        this.threads = res.data.threads;
      });
  }

  filterNaN(input: any): any {
    if (isNaN(input)) {
      return 0;
    }
    return input;
  }

  formatNumber1(value: any): any {
    return numeral(value).format('0,0');
  }

  formatNumber2(value: any): any {
    return numeral(value).format('0,00');
  }
}
