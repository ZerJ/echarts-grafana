/* jshint esversion: 6 */
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import rendering from './rendering';

export class Controller extends MetricsPanelCtrl {
  constructor($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    const optionDefaults = {
      type: 'map',
      legend: {
        show: true,
        values: true
      },
      links: [],
      datasource: null,
      maxDataPoints: 3,
      interval: null,
      targets: [{}],
      cacheTimeout: null,
      nullPointMode: 'connected',
      legendType: 'Under graph',
      aliasColors: {},
      format: 'short',
      valueName: 'current',
      strokeWidth: 1,
      fontSize: '80%',
      thresholds: '0,200',
      unitSingle: '',
      unitPlural: '',
      esMetric: 'Count',
    };

    _.defaults(this.panel, optionDefaults);
    _.defaults(this.panel.legend, optionDefaults.legend);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onRender() {
  }

  onDataReceived(dataList) {
    const [data] = dataList;
    this.name = [];
    this.value = [];
    this.dname = [];
    this.nation = [];
    if (data) {
      data.rows.forEach(([name, value,dname,nation]) => {
        this.name.push(name);
        this.value.push(value);
        this.dname.push(dname);
        this.nation.push(nation)
      });
    }
    this.render();
  }

  onDataError() {
    this.render();
  }

  onInitEditMode() {
    this.addEditorTab('图表选项', 'public/plugins/echarts-grafana/partials/module.editor.html', 2);
    this.unitFormats = kbn.getUnitFormats();
  }

  link(scope, elem, attrs, ctrl) {
    rendering(scope, elem, attrs, ctrl);
  }

}

Controller.templateUrl = './partials/module.html';
