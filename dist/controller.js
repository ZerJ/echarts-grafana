'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', './rendering'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, kbn, rendering, _slicedToArray, _createClass, Controller;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_rendering) {
      rendering = _rendering.default;
    }],
    execute: function () {
      _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Controller', Controller = function (_MetricsPanelCtrl) {
        _inherits(Controller, _MetricsPanelCtrl);

        function Controller($scope, $injector, $rootScope) {
          _classCallCheck(this, Controller);

          var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;

          var optionDefaults = {
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
            esMetric: 'Count'
          };

          _.defaults(_this.panel, optionDefaults);
          _.defaults(_this.panel.legend, optionDefaults.legend);

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          return _this;
        }

        _createClass(Controller, [{
          key: 'onRender',
          value: function onRender() {}
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var _this2 = this;

            var _dataList = _slicedToArray(dataList, 1),
                data = _dataList[0];

            this.name = [];
            this.value = [];
            this.dname = [];
            if (data) {
              data.rows.forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    name = _ref2[0],
                    value = _ref2[1],
                    dname = _ref2[2];

                _this2.name.push(name);
                _this2.value.push(value);
                _this2.dname.push(dname);
              });
            }
            this.render();
          }
        }, {
          key: 'onDataError',
          value: function onDataError() {
            this.render();
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('图表选项', 'public/plugins/echarts-grafana/partials/module.editor.html', 2);
            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            rendering(scope, elem, attrs, ctrl);
          }
        }]);

        return Controller;
      }(MetricsPanelCtrl));

      _export('Controller', Controller);

      Controller.templateUrl = './partials/module.html';
    }
  };
});
//# sourceMappingURL=controller.js.map
