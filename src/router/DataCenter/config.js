import echarts from 'echarts'

const option = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let key = params[0].data[0]
      let value = params[0].data[1]
      if (params[0].axisType == 'xAxis.value') {
        key = key + ':00' + ' - ' + key + ':59'
      }

      return key + '<br>' +
        '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#20a0ff"></span>' +
        params[0].seriesName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + value
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f0f0f0'
      }
    },
    boundaryGap: [0, '100%'],
    minInterval: 1,
  },
  series: [{
    type: 'line',
    showSymbol: true,
    hoverAnimation: true,
    symbol:'circle',//拐点样式
    symbolSize: 6,//拐点大小
    showAllSymbol: true,
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#e6f3fe'
        }, {
          offset: 1,
          color: '#e6f3fe'
        }], false)
      }
    },
    data: []
  }],
  color: ['#20a0ff'],
}

const s_option = {
  title : {
    x:'center'
  },
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    /*left: 'right',
    top: 'middle',*/
  },
  series : [
    {
      type: 'pie',
      radius : '55%',
      center: ['50%', '60%'],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  color: ['#00cc66', '#ed7d31', '#5b9bd5']
}

export {
  option,
  s_option
}
