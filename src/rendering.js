import echarts from './libs/echarts.min';
import _ from "lodash";
import './libs/geocoord';
export default function link(scope, elem, attrs, ctrl) {
  const $panelContainer = elem.find('.echarts-grafana')[0];
  ctrl.refreshed = true;
  $panelContainer.oncontextmenu = function () { return false; };
  let myChart = echarts.init($panelContainer, 'dark');
  function setHeight() {
    let panel=ctrl.panel;
    let height = ctrl.height || panel.height;
    if (_.isString(height)) {
      height = parseInt(height.replace('px', ''), 10);
    }
    $panelContainer.style.height = height + 'px';
  }
  var mapStack = [];
  var parentId = null;
  var parentName = null;
  var count =null;
  var location =[];
  setHeight();
  setTimeout(function () {
    myChart.resize();
  }, 3000);
  // function dataFormatter() {
  //   const {name, value} = ctrl;
  //   let wdata =[];
  //   let ndata =[];
  //   let pdata =[];
  //   let sdata =[];
  //   for (let k in name){
  //     if(count===0){
  //       for(let nation in nameMap) {
  //         if( nameMap[nation] === name[k].split(',')[0]){
  //           wdata.push({name:nation,value:value[k]});
  //         }
  //       }
  //     }
  //     if(count===1&&name[k].split(',')[1]!==undefined){
  //       if(name[k].split(',')[1].indexOf("省") !== -1){
  //         let province = name[k].split(',')[1].split("省")[0]
  //         ndata.push({name:province,value:value[k]})
  //       }else {
  //         ndata.push({name:name[k].split(',')[1],value:value[k]})
  //       }
  //     }
  //     if(count===2&&name[k].split(',')[2]!==undefined){
  //       pdata.push({name:name[k].split(',')[2],value:value[k]})
  //     }
  //     if(count===3&&name[k].split(',')[3]!==undefined){
  //       sdata.push({name:name[k].split(',')[3],value:value[k]})
  //     }
  //   }
  //   switch (count) {
  //     case 0:
  //       return wdata;
  //     case 1:
  //       return ndata;
  //     case 2:
  //       return pdata;
  //     case 3:
  //       return sdata;
  //   }
  // }
  function getData(chartType) {
    const {name, value,dname} = ctrl;
    let data =[];
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
          for(let i in name){
            if(geoCoordMap[name[i]].length<=2){
              geoCoordMap[name[i]].push(parseInt(value[i]))
            }
            data.push({name:name[i], value:geoCoordMap[name[i]]})
          }
          data.push({name:"zzxas", value:[101.593,24.8642]})
          return data;
        case 'WorldGeo':
          for(let i in name){
            if (typeof (geoCoordMap[name[i]])!=="undefined"){
              if(geoCoordMap[name[i]].length<=2){
                geoCoordMap[name[i]].push(parseInt(value[i]))
              }
              data.push({name:name[i], value:geoCoordMap[name[i]]});
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
  function datas(features) {
    const {name, value, dname,nation} = ctrl;
    let data =[];
    let index=[];
    for(let i in nation ){
      if(nation[i]!==undefined&&nation[i]!==null){
        for(let key in nameMap){
          if(nameMap[key] === nation[i]){
            location.push([key,parseFloat(value[i]),parseFloat(name[i]),dname[i]])
            data.push({name:key,value:dname[i]})
          }
        }
      }else {
        let result =forJson([parseFloat(value[i]),parseFloat(name[i])],features)
        location.push([result,parseFloat(value[i]),parseFloat(name[i]),dname[i]])
        data.push({name:result,value:dname[i]})
      }
    }
    return data
  }
  function dataFormatter(area,datas,features,cityId,name,flag,f) {
      if(flag){
        mapStack.push({
          mapId: parentId,
          mapName: parentName,
          mapData: datas
        });
        parentId = cityId;
        parentName = name;
      }
      location=[];
      let data =[];
      console.log(count)
      if(count===0){
        for (let i in datas) {
          data.push({name: datas[i][0], value: datas[i][3]});
          location.push([datas[i][0], datas[i][1], datas[i][2], datas[i][3]])
        }
      }else {
        for (let i in datas){
          if (datas[i][0]===area&&f){
            let result =forJson([datas[i][1],datas[i][2]],features)
            data.push({name:result,value:datas[i][3]});
            location.push([result,datas[i][1],datas[i][2],datas[i][3]])
          }else if (!f) {
            let result =forJson([datas[i][1],datas[i][2]],features)
            data.push({name:result,value:datas[i][3]});
            location.push([result,datas[i][1],datas[i][2],datas[i][3]])
          }
        }
      }
      return data
  }
  function render() {

    if (!myChart) {
      return;
    }
    myChart.resize();
    setHeight();
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
      myChart.resize();
      let chartName = ctrl.panel.chartName;
      let chartType = ctrl.panel.chartType;
      let chartSerilaName = ctrl.panel.serialName;
      if(!chartSerilaName){
        chartSerilaName=""
      }
      let chartMin = ctrl.panel.min;
      let chartMax = ctrl.panel.max;
      if (!chartMin || !chartMax){
        chartMin=1;
        chartMax=100;
      }

      if (chartType === 'ChinaMap') {
        parentId='100000';
        parentName='china';
        count=1;
        // let data = getData(chartType);
        window.$.getJSON('public/plugins/echarts-grafana/data/100000.json',function(Json){
          echarts.registerMap('china', Json);
          let data =datas(Json.features);
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
              formatter: function (params) {
                let nation =null
                for(let key in nameMap){
                  if(params.name===key){
                    nation =nameMap[key]
                  }
                }
                if (nation&&params.value){
                  return nation + ' : ' + parseInt(params.value).toLocaleString();
                }else if(nation){
                  return nation + ' : ';
                }else if(params.value){
                  return params.name+':'+parseInt(params.value).toLocaleString();
                }else {
                  return params.name+':'
                }
              },
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
                showLegendSymbol: false,
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
        });
        myChart.off("click");
        myChart.on("click",function (parms) {
          mapStack.push({
            mapId: parentId,
            mapName:parentName,
            mapData:location
          });
          var cityID =CityMap[parms.name];
          parentId = cityID;
          parentName = parms.name;
          if(cityID){
            count=count+1;
            ChangeMap(cityID,parms.name,chartType,chartMin,chartMax,chartName,chartSerilaName,false,true);
          }
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
        window.$.getJSON('public/plugins/echarts-grafana/data/china.json',function(Json){
          echarts.registerMap('china', Json);
          myChart.setOption(option);
        });
      }

      if (chartType === 'WorldMap') {
        parentId = '000001';
        parentName = 'world';
        count=0;
        $.getJSON('public/plugins/echarts-grafana/data/'+parentId+'.json').then((Json) => {
          echarts.registerMap('world', Json);
          let data =datas(Json.features);
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
              formatter: function (params) {
                let nation =null
                for(let key in nameMap){
                  if(params.name===key){
                    nation =nameMap[key]
                  }
                }
                if (nation&&params.value){
                  return nation + ' : ' + parseInt(params.value).toLocaleString();
                }else if(nation){
                  return nation + ' : ';
                }else if(params.value){
                  return params.name+':'+parseInt(params.value).toLocaleString();
                }else {
                  return params.name+':'
                }
              },
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
                showLegendSymbol: false,
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
          // echarts.dispose(myChart);
          // myChart = echarts.init($panelContainer, 'dark');
          myChart.setOption(option);
        });
        myChart.off("click");
        myChart.on("click",function (parms) {
          mapStack.push({
            mapId: parentId,
            mapName:parentName,
            mapData:location
          });
          var cityID =CityMap[parms.name];
          if(cityID!==undefined){
            parentId = cityID;
            parentName = parms.name;
            if(cityID){
              count=count+1;
              ChangeMap(cityID,parms.name,chartType,chartMin,chartMax,chartName,chartSerilaName,false,true);
            }
          }
          // else {
          //   count=count+1;
          //   changeNation(parms.name,chartType,chartMin,chartMax,chartName,chartSerilaName)
          // }

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
        window.$.getJSON('public/plugins/echarts-grafana/data/world.json',function(Json){
          echarts.registerMap('world', Json);
          myChart.setOption(option);
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
        window.$.getJSON('public/plugins/echarts-grafana/data/world.json',function(Json){
          echarts.registerMap('world', Json);
          myChart.setOption(option);
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
        window.$.getJSON('public/plugins/echarts-grafana/data/china.json',function(Json){
          echarts.registerMap('china', Json);
          myChart.setOption(option);
        });
      }
    }
  }
  function ChangeMap(cityId,name,chartType,chartMin,chartMax,chartName,chartSerilaName,flag,f) {
    registerMap(cityId,name,chartMin,chartMax,chartName,chartSerilaName,flag,f);
    $panelContainer.onmouseup=function(oEvent) {
      if (!oEvent) oEvent = window.event;
      if (oEvent.button === 2) {
        setTimeout(function () {
          count=count-1;
          backMap(chartType,chartMin,chartMax,chartName,chartSerilaName);
        }, 250);
      }
    };
    myChart.off('click');
    myChart.on("click",function (parms) {
      console.log(parms.name);
      var cityID =CityMap[parms.name];
      if(cityID){
        count=count+1;
        registerMap(cityID,parms.name,chartMin,chartMax,chartName,chartSerilaName,true,true);
      }
      // else if (count===0){
      //   count=count+1;
      //   changeNation(parms.name,chartType,chartMin,chartMax,chartName,chartSerilaName)
      // }
    });

  }
  function registerMap(cityId,name,chartMin,chartMax,chartName,chartSerilaName,flag,f) {
    //let data=dataFormatter();
    if (name ==="world"){
      count=0;
    }
    if (name ==="china"){
      count=1;
    }
    $.getJSON('public/plugins/echarts-grafana/data/'+cityId+'.json',function (Json) {
      echarts.registerMap(name, Json);
      //let data =datas(Json.features);
      let list =location;
      let data =dataFormatter(name,list,Json.features,cityId,name,flag,f);
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
          formatter: function (params) {
            let nation =null;
            if(count===0){
              for(let key in nameMap){
                if(params.name===key){
                  nation =nameMap[key]
                }
              }
            }
            if (nation&&params.value){
              return nation + ' : ' + parseInt(params.value).toLocaleString();
            }else if(nation){
              return nation + ' : ';
            }else if(params.value){
              return params.name+':'+parseInt(params.value).toLocaleString();
            }else {
              return params.name+':'
            }
          },

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
            mapType: name,
            hoverable: true,
            showLegendSymbol: false,
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
      setTimeout(function () {
        myChart.setOption(option,true);
      }, 250);
    });

  }
  function backMap (chartType,chartMin,chartMax,chartName,chartSerilaName){
    if (mapStack.length !== 0) {//如果有上级目录则执行
      var map = mapStack.pop();
      registerMap(map.mapId,map.mapName,chartMin,chartMax,chartName,chartSerilaName,false);
      location=map.mapData;
      parentId = map.mapId;
      parentName = map.mapName;
    }
  }
  function forJson(p,features) {
    for(let i in features){
      for(let j in features[i].geometry.coordinates){
        if (count===2){
          if(features[i].properties.cp&&Math.abs(features[i].properties.cp[0]-p[0])<0.1&&Math.abs(features[i].properties.cp[1]-p[1])<0.1){
            return  features[i].properties.name
          }else {
            if (features[i].geometry.encodeOffsets !== undefined) {
              if (features[i].geometry.type === "MultiPolygon") {
                for (let k in features[i].geometry.coordinates[j]) {
                  let decodeData = decodePolygon(features[i].geometry.coordinates[j][k], features[i].geometry.encodeOffsets)
                  if (rayCasting(p, decodeData)) {
                    return features[i].properties.name
                  }
                }
              } else {
                let decodeData = decodePolygon(features[i].geometry.coordinates[j], features[i].geometry.encodeOffsets)
                if (rayCasting(p, decodeData)) {
                  return features[i].properties.name
                }
              }
            }
          }
        }
        if (features[i].geometry.type==="MultiPolygon") {
          for (let k in features[i].geometry.coordinates[j]) {
            if (count === 1&&features[i].geometry.encodeOffsets!==undefined) {
              let decodeData = decodePolygon(features[i].geometry.coordinates[j][k], features[i].geometry.encodeOffsets[j]);
              if (rayCasting(p, decodeData)) {
                return features[i].properties.name
              }
            }
            else if (rayCasting(p, features[i].geometry.coordinates[j][k])) {
              return features[i].properties.name
            }
          }
        } else {
          if (count === 1&&features[i].geometry.encodeOffsets!==undefined) {
            let decodeData = decodePolygon(features[i].geometry.coordinates[j], features[i].geometry.encodeOffsets);
            if (rayCasting(p, decodeData)) {
              return features[i].properties.name
            }
          } else {
            if (rayCasting(p, features[i].geometry.coordinates[j])) {
              return features[i].properties.name
            }
          }
        }
        }
    }
    return null
  }
  function decodePolygon(coordinate, encodeOffsets) {
    var result = [];
    var prevX = encodeOffsets[0][0];
    var prevY = encodeOffsets[0][1];
    for (var i = 0; i < coordinate.length; i += 2) {
      var x = coordinate.charCodeAt(i) - 64;
      var y = coordinate.charCodeAt(i + 1) - 64;
      // ZigZag decoding
      x = (x >> 1) ^ (-(x & 1));
      y = (y >> 1) ^ (-(y & 1));
      // Delta deocding
      x += prevX;
      y += prevY;

      prevX = x;
      prevY = y;
      // Dequantize
      result.push([x / 1024, y / 1024]);
    }
    return result;
  }
  function rayCasting(checkPoint, polygonPoints) {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
      p2 = polygonPoints[i % pointCount];
      if (
        checkPoint[0] > Math.min(p1[0], p2[0]) &&
        checkPoint[0] <= Math.max(p1[0], p2[0])
      ) {
        if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
          if (p1[0] !== p2[0]) {
            xinters =
              (checkPoint[0] - p1[0]) *
              (p2[1] - p1[1]) /
              (p2[0] - p1[0]) +
              p1[1];
            if (p1[1] === p2[1] || checkPoint[1] <= xinters) {
              counter++;
            }
          }
        }
      }
      p1 = p2;
    }
    if(counter % 2 === 0){
      return false;
    } else {
      return true;
    }
  }
  ctrl.events.on('render', function () {
    render();
    ctrl.renderingCompleted();
  });

}
