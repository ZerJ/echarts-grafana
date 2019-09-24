import echarts from './libs/echarts.min';
import _ from "lodash";
import './libs/geocoord';
export default function link(scope, elem, attrs, ctrl) {
  const $panelContainer = elem.find('.echarts-grafana')[0];
  ctrl.refreshed = true;
  function setHeight() {
    let panel=ctrl.panel;
    let height = ctrl.height || panel.height;
    if (_.isString(height)) {
      height = parseInt(height.replace('px', ''), 10);
    }
    $panelContainer.style.height = height + 'px';
  }
  setHeight();

  let myChart = echarts.init($panelContainer, 'dark');

  setTimeout(function () {
    myChart.resize();
  }, 1000);
  function getData(chartType) {
    const {name, value,dname} = ctrl;
    let data =[];
    console.log(name);
    if (name){
      switch (chartType) {
        case 'ChinaMap':
          for (let i = 0; i < name.length; i++) {
            data.push({name: name[i], value: value[i]});
          }
          return data;
        case 'WorldMap':
          let forname;
          for(let key in nameMap) {
            for (let i=0;i<name.length;i++){
              if( nameMap[key] === name[i]){
                forname = key;
                data.push({name:forname,value:value[i]});
              }
            }
          }
          return data;
        case 'ChinaGeo':
          for(let i=0;i<name.length;i++){
            if(geoCoordMap[name[i]].length<=2){
              geoCoordMap[name[i]].push(parseInt(value[i]))
            }
            data.push({name:name[i], value:geoCoordMap[name[i]]})
          }
          return data;
        case 'WorldGeo':
          for(let i=0;i<name.length;i++){
            console.log(name[i]);
            if (typeof (geoCoordMap[name[i]])!=="undefined"){
              if(geoCoordMap[name[i]].length<=2){
                console.log("===3==");
                geoCoordMap[name[i]].push(parseInt(value[i]))
              }
              data.push({name:name[i], value:geoCoordMap[name[i]]})
            }
          }
          return data;
        case 'ChinaFlow':
          for (let i = 0; i < name.length; i++) {
            data.push({name: name[i], value: value[i],dname:dname[i]});
          }
          return data;
        case 'WorldFlow':
          for (let i = 0; i < name.length; i++) {
            data.push({name: name[i], value: value[i],dname:dname[i]});
          }
          return data;
      }
    }

  }
  function render() {

    if (!myChart) {
      return;
    }

    setHeight();
    myChart.resize();

    if (ctrl.refreshed) {
      let convertData = function(item) {
        let res = [];
        let fromCoord = geoCoordMap[item.name];
        let toCoord = geoCoordMap[item.dname];
        if(fromCoord && toCoord) {
          res.push([{
            coord: fromCoord // 起点坐标
          }, {
            coord: toCoord // 终点坐标
          }])
        }
        return res;
      };
      let scatterData=function(item){
        let dataformate =[];
        dataformate.push({name:item.dname,value:geoCoordMap[item.dname]});
        return dataformate
      };
      let cityData=function(item) {
        let dataformate =[];
        if (geoCoordMap[item.name].length<=2){
          geoCoordMap[item.name].push(parseInt(item.value));
        }
        dataformate.push({name:item.name,value:geoCoordMap[item.name]});
        return dataformate
      };
      let series= [
        {
          name: chartSerilaName,
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbolSize: 12,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          center: [-6.6796875,32.84267363195431],
        }];
      myChart.clear();
      let chartName = ctrl.panel.chartName;
      let chartType = ctrl.panel.chartType;
      let chartSerilaName = ctrl.panel.serialName;
      let chartMin = ctrl.panel.min;
      let chartMax = ctrl.panel.max;
      if (!chartMin || !chartMax){
        chartMin=1;
        chartMax=100;
      }

      if (chartType === 'ChinaMap') {
        let data = getData(chartType);
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              name: chartSerilaName,
              type: 'map',
              mapType: 'china',
              hoverable: true,
              roam: true,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {label: {show: true}, areaColor: '#edf2f1'},
                emphasis: {label: {show: true}, areaColor: '#ffeb59'}
              },
              data: data
            }
          ]
        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/china.json').then((Json) => {
          echarts.registerMap('china', Json);
        });
      }

      if (chartType === 'ChinaGeo') {
        let data = getData(chartType);
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + ' : ' + params.value[2];
            },
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'china',
            roam:true,
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },

          series: [
            {
              name: chartSerilaName,
              type: 'effectScatter',
              coordinateSystem: 'geo',
              symbolSize: 12,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: '#fff',
                  borderWidth: 1
                }
              },
              data: data
            }
          ]
        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/china.json').then((Json) => {
          echarts.registerMap('china', Json);
        });
      }

      if (chartType === 'WorldMap') {
        let data = getData(chartType);
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              name: chartSerilaName,
              type: 'map',
              mapType: 'world',
              hoverable: true,
              roam: true,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {label: {show: true}, areaColor: '#edf2f1'},
                emphasis: {label: {show: true}, areaColor: '#ffeb59'}
              },
              center: [-6.6796875,32.84267363195431],
              data: data
            }
          ]
        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/world.json').then((Json) => {
          echarts.registerMap('world', Json);
        });
      }

      if (chartType === 'WorldGeo'){
        let data =getData(chartType);
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + ' : ' + params.value[2];
            },
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'world',
            roam:true,
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },

          series: [
            {
              name: chartSerilaName,
              type: 'effectScatter',
              coordinateSystem: 'geo',
              symbolSize: 12,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: '#fff',
                  borderWidth: 1
                }
              },
              center: [-6.6796875,32.84267363195431],

              data: data
            }
          ]

        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/world.json').then((Json) => {
          echarts.registerMap('world', Json);
        });
      }

      if (chartType === 'WorldFlow') {
        let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        let colors = ['#9ae5fc', '#dcbf71']; // 自定义图中要用到的颜色
        let data = getData(chartType);
        data.forEach(function (item){
          series.push({
              // 白色航线特效图
              type: 'lines',
              zlevel: 1, // 用于分层，z-index的效果
              effect: {
                show: true, // 动效是否显示
                period: 6, // 特效动画时间
                trailLength: 0.7, // 特效尾迹的长度
                color: '#fff', // 特效颜色
                symbolSize: 3 // 特效大小
              },
              lineStyle: {
                normal: { // 正常情况下的线条样式
                  color: colors[0],
                  width: 0, // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
                  curveness: -0.2 // 线条曲度
                }
              },
              data: convertData(item) // 特效的起始、终点位置
            }, { // 小飞机航线效果
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'], // 用于设置箭头
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: planePath, // 特效形状，可以用其他svg pathdata路径代替
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: colors[0],
                  width: 1,
                  opacity: 0.6,
                  curveness: -0.2
                }
              },
              data: convertData(item), // 特效的起始、终点位置，一个二维数组，相当于coords: convertData(item[1])
            }, { // 散点效果
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'left',
                formatter: '{b}'
              }
            },
            itemStyle: {
              normal: {
                color: colors[1]
              }
            },
              data: cityData(item)
            }

          );
          series.push({
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'left',
                formatter: '{b}'
              }
            },
            itemStyle: {
              normal: {
                color: colors[1]
              }
            },
            data: scatterData(item)
          })
        });
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name){
                return params.name
              }else if(params.data.coord) {
                return params.data.coord[2]
              }
            },
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'world',
            roam: true,
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            },
            regions: [{ // 选中的区域
              name: 'China',
              selected: true,
              itemStyle: { // 高亮时候的样式
                emphasis: {
                  areaColor: '#7d7d7d'
                }
              },
              label: { // 高亮的时候不显示标签
                emphasis: {
                  show: false
                }
              }
            }]
          },
          series :series,
        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/world.json').then((Json) => {
          echarts.registerMap('world', Json);
        });
      }

      if (chartType === 'ChinaFlow') {
        let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var color = ['#9ae5fc', '#dcbf71']; // 自定义图中要用到的颜色
        let data=getData(chartType);
        data.forEach(function (item){
          series.push({
              // 白色航线特效图
              type: 'lines',
              zlevel: 1, // 用于分层，z-index的效果
              effect: {
                show: true, // 动效是否显示
                period: 6, // 特效动画时间
                trailLength: 0.7, // 特效尾迹的长度
                color: '#fff', // 特效颜色
                symbolSize: 3 // 特效大小
              },
              lineStyle: {
                normal: { // 正常情况下的线条样式
                  color: color[0],
                  width: 0, // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
                  curveness: -0.2 // 线条曲度
                }
              },
              data: convertData(item) // 特效的起始、终点位置
            }, { // 小飞机航线效果
              type: 'lines',
              zlevel: 2,
              //symbol: ['none', 'arrow'], // 用于设置箭头
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: planePath, // 特效形状，可以用其他svg pathdata路径代替
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: color[0],
                  width: 1,
                  opacity: 0.6,
                  curveness: -0.2
                }
              },
              data: convertData(item), // 特效的起始、终点位置，一个二维数组，相当于coords: convertData(item[1])
            }, { // 散点效果
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  formatter: '{b}'
                }
              },
              itemStyle: {
                normal: {
                  color: color[1]
                }
              },
              data: cityData(item)
            }

          );
          series.push({
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'left',
                formatter: '{b}'
              }
            },
            itemStyle: {
              normal: {
                color: color[1]
              }
            },
            data: scatterData(item)
          })
        });
        const option = {
          title: {
            text: chartName,
            left: 'center',
            textStyle: {color: '#ffffff', fontSize: 12}
          },
          backgroundColor: '#404a59',
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name){
                return params.name
              }else if(params.data.coord) {
                return params.data.coord[2]
              }
            },
            padding: 10,
            backgroundColor: 'rgba(20,20,20,0.8)',
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          visualMap: {
            min: chartMin,
            max: chartMax,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'china',
            roam:true,
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            },
          },
          series :series,
        };
        myChart.setOption(option);
        window.$.getJSON('public/plugins/echarts-grafana/data/china.json').then((Json) => {
          echarts.registerMap('china', Json);
        });
      }
    }
  }

  ctrl.events.on('render', function () {
    render();
    ctrl.renderingCompleted();
  });

}
