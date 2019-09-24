"use strict";

System.register(["app/plugins/sdk", "lodash", "app/core/utils/kbn", "./rendering"], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, kbn, rendering, Controller;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
      _export("Controller", Controller =
      /*#__PURE__*/
      function (_MetricsPanelCtrl) {
        _inherits(Controller, _MetricsPanelCtrl);

        function Controller($scope, $injector, $rootScope) {
          var _this;

          _classCallCheck(this, Controller);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(Controller).call(this, $scope, $injector));
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

          _this.events.on('render', _this.onRender.bind(_assertThisInitialized(_this)));

          _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

          _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)));

          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_assertThisInitialized(_this)));

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

          return _this;
        }

        _createClass(Controller, [{
          key: "onRender",
          value: function onRender() {}
        }, {
          key: "onDataReceived",
          value: function onDataReceived(dataList) {
            var _this2 = this;

            var _dataList = _slicedToArray(dataList, 1),
                data = _dataList[0];

            this.name = [];
            this.value = [];
            this.dname = [];
            this.nation = [];

            if (data) {
              data.rows.forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 4),
                    name = _ref2[0],
                    value = _ref2[1],
                    dname = _ref2[2],
                    nation = _ref2[3];

                _this2.name.push(name);

                _this2.value.push(value);

                _this2.dname.push(dname);

                _this2.nation.push(nation);
              });
            }

            this.render();
          }
        }, {
          key: "onDataError",
          value: function onDataError() {
            this.render();
          }
        }, {
          key: "onInitEditMode",
          value: function onInitEditMode() {
            this.addEditorTab('图表选项', 'public/plugins/echarts-grafana/partials/module.editor.html', 2);
            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: "link",
          value: function link(scope, elem, attrs, ctrl) {
            rendering(scope, elem, attrs, ctrl);
          }
        }]);

        return Controller;
      }(MetricsPanelCtrl));

      Controller.templateUrl = './partials/module.html';
    }
  };
});
//# sourceMappingURL=controller.js.map
