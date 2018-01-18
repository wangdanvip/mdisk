<template>
  <div class="main_wrapper wrap_shoadow">
    <div class="picArea">
      <div class="picItem">
        <div class="timeTarget" style="margin-bottom: 15px">
          <label>{{i18n.time + i18n.colon}}</label>
          <el-button-group>
            <el-button @click="select_time('1')" :class="{selected: dateType =='1'}">{{i18n.yesterday}}</el-button>
            <el-button @click="select_time('2')" :class="{selected: dateType =='2'}">{{i18n.seven_day}}</el-button>
            <el-button @click="select_time('3')" :class="{selected: dateType =='3'}">{{i18n["30day"]}}</el-button>
            <el-button @click="select_time('4')" :class="{selected: dateType =='4'}">{{i18n.history}}</el-button>
          </el-button-group>
          <el-date-picker
            v-model="date"
            ref="daterange"
            @change="select_time('5')"
            type="daterange"
            :clearable = "clearable"
            :placeholder="i18n.pick_date"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-select v-model="area" @change="select_area" ref="select" class="pull-right">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <el-row style="border-bottom: 1px solid #d1dbe5;margin-bottom: 15px;">
          <el-col :span="5">
            {{i18n.pageviews}}
            <el-tooltip class="item" effect="light" :content="i18n.pageviews_tip" placement="bottom-start">
              <i class="iconfont icon-icon-question icon-action"></i>
            </el-tooltip>
            <div class="value">{{visit_data.pv}}</div>
          </el-col>
          <el-col :span="5">
            {{i18n.visitors}}
            <el-tooltip class="item" effect="light" :content="i18n.visitors_tip" placement="bottom-start">
              <i class="iconfont icon-icon-question icon-action"></i>
            </el-tooltip>
            <div class="value">{{visit_data.uv}}</div>
          </el-col>
          <el-col :span="5">
            {{i18n.new_users}}
            <el-tooltip class="item" effect="light" :content="i18n.new_users_tip" placement="bottom-start">
              <i class="iconfont icon-icon-question icon-action"></i>
            </el-tooltip>
            <div class="value">{{visit_data.nu}}</div>
          </el-col>
          <el-col :span="5">
            {{i18n.total_users}}
            <el-tooltip class="item" effect="light" :content="i18n.total_users_tip" placement="bottom-start">
              <i class="iconfont icon-icon-question icon-action"></i>
            </el-tooltip>
            <div class="value">{{visit_data.tu}}</div>
          </el-col>
          <el-col :span="4">
            <div @click="table_view('access_time')" style="cursor: pointer;">
              {{i18n.access_time}}
              <el-tooltip class="item" effect="light" :content="i18n.access_time_tip" placement="bottom-start">
                <i class="iconfont icon-icon-question icon-action"></i>
              </el-tooltip>
              <div class="value">{{visit_data.pst}}</div>
            </div>
          </el-col>
        </el-row>
        <div>
          <label>{{i18n.target + i18n.colon}}</label>
          <el-radio-group v-model="type" @change="select_type">
            <el-radio :label="'1'">{{i18n.pageviews}}</el-radio>
            <el-radio :label="'2'">{{i18n.visitors}}</el-radio>
            <el-radio :label="'3'">{{i18n.new_users}}</el-radio>
            <el-radio :label="'4'">{{i18n.total_users}}</el-radio>
          </el-radio-group>
        </div>
        <div id="chartLine" style="width:100%; height:400px;"></div>
      </div>

      <div class="picItem">
        <el-row>
          <el-col :span="12">
            <div @click="table_view('u_storage')" id="u_storageChart" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div @click="table_view('g_storage')" id="g_storageChart" style="width:100%; height:400px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import {getVisit, getTrend, getStore} from './request'
  import {option, s_option} from './config'

  export default {
    data() {
      let i18n = this.i18n
      return ({
        date: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
        },
        clearable: false,
        dateType: '1',
        visit_data: {
          pv: 0,
          uv: 0,
          nu: 0,
          tu: 0,
          pst: '00:00:00',
        },
        area: '',
        options: [{
          value: '',
          label: i18n.all_data
        }, {
          value: 'cn',
          label: i18n.mainland_data
        }, {
          value: 'hk',
          label: i18n.INT_data
        }],
        type: '1',
        typeMap: {
          1: i18n.pageviews,
          2: i18n.visitors,
          3: i18n.new_users,
          4: i18n.total_users
        },
        chart: null,
        u_storageChart: null,
        g_storageChart: null
      })
    },
    computed: {
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      }
    },
    methods: {
      select_time(t) {
        if (t == '5' && this.date[0] == null) {
          return
        }
        if (t != '5') {
          this.$refs.daterange.currentValue = ''
        }
        this.dateType = t
        this.get_visit()
        this.getTrend()
      },
      select_area() {
        this.get_visit()
        this.getTrend()
      },
      select_type() {
        this.getTrend()
        this.get_visit()
      },
      get_visit() {
        let params = {
          site: this.area,
          dateType: this.dateType,
          token: this.token,
        }
        if (this.dateType == 5) {
          params.beginDate = this.dateFormat(this.date[0], 'yyyy-MM-dd')
          params.endDate = this.dateFormat(this.date[1], 'yyyy-MM-dd')
        }
        getVisit(params).then(data => {
          try {
            this.visit_data = data.result
          } catch (e) {
            console.log(e)
          }
        })
      },
      getTrend() {
        let params = {
          site: this.area,
          type: this.type,
          dateType: this.dateType,
          token: this.token,
        }
        if (this.dateType == 5) {
          params.beginDate = this.dateFormat(this.date[0], 'yyyy-MM-dd')
          params.endDate = this.dateFormat(this.date[1], 'yyyy-MM-dd')
        }

        getTrend(params).then((data) => {
          try {
            let result = data.result.map(d => {
              return [
                d.create_time,
                d.num
              ]
            })
            if ((this.dateType == '1' && this.type != '4') || (this.dateType == '5' && params.beginDate == params.endDate && this.type != '4')) {
              this.chart.setOption({
                xAxis: {
                  type: 'value',
                  splitLine: {
                    show: false
                  },
                },
              })
            } else {
              this.chart.setOption({
                xAxis: {
                  type: 'category',
                  splitLine: {
                    show: false
                  },
                  boundaryGap: false,
                  data: data.result.map(d => {
                    return d.create_time
                  })
                },
              })
            }
            this.chart.setOption({
              series: [{
                showAllSymbol: !(this.dateType == '4'),
                name: this.typeMap[this.type],
                data: result
              }],
            })
          } catch(e) { console.log(e) }
        })
      },
      getStore() {
        let params = {
          token: this.token
        }
        getStore(params).then((data) => {
          try {
            this.drawColumn(data && data.result)
          } catch(e) { console.log(e) }
         })
      },
      drawColumn(s) {
        this.u_storageChart.setOption({
          title: {
            text: this.i18n.u_storage
          },
          legend: {
            data: [this.i18n.cn_used, this.i18n.hk_used, this.i18n.unused],
            formatter: '{name}'
          },
          series: [
            {
              name: this.i18n.u_storage,
              data: [
                {value: (s.personalUseCN/1024/1024).toFixed(2), name: this.i18n.cn_used},
                {value: (s.personalUseHK/1024/1024).toFixed(2), name: this.i18n.hk_used},
                {value: (s.personalFree/1024/1024).toFixed(2), name: this.i18n.unused},
              ],
            }
          ]
        })

        this.g_storageChart.setOption({
          title: {
            text: this.i18n.g_storage
          },
          legend: {
            data: [this.i18n.cn_used, this.i18n.hk_used, this.i18n.unused],
            formatter: '{name}'
          },
          series: [
            {
              name: this.i18n.g_storage,
              data: [
                {value: (s.groupUseCN/1024/1024).toFixed(2), name: this.i18n.cn_used},
                {value: (s.groupUseHK/1024/1024).toFixed(2), name: this.i18n.hk_used},
                {value: (s.groupFree/1024/1024).toFixed(2), name: this.i18n.unused},
              ],
            }
          ]
        })
      },
      table_view(name) {
        let config = {
          name: name
        }
        if (name == 'access_time') {
          config.query = {
            dateType: this.dateType
          }
          if (this.dateType == '5') {
            config.query.beginDate = this.dateFormat(this.date[0], 'yyyy-MM-dd')
            config.query.endDate = this.dateFormat(this.date[1], 'yyyy-MM-dd')
          }
        }
       this.$router.push(config)
      },
      scrollFunc() {
        this.$refs.select.handleClose()
      },
    },
    created() {
      this.get_visit()
    },
    mounted() {
      this.chart = echarts.init(document.getElementById('chartLine'))
      this.chart.setOption(option)
      this.getTrend()

      this.u_storageChart = echarts.init(document.getElementById('u_storageChart'))
      this.u_storageChart.setOption(s_option)
      this.g_storageChart = echarts.init(document.getElementById('g_storageChart'))
      this.g_storageChart.setOption(s_option)
      this.getStore()

      if(document.addEventListener){
        document.addEventListener('DOMMouseScroll', this.scrollFunc)
      }
      window.onmousewheel = document.onmousewheel = this.scrollFunc
    },
    destroyed() {
      if (document.removeEventListener) {
        document.removeEventListener('DOMMouseScroll', this.scrollFunc)
      }
      window.onmousewheel = document.onmousewheel = null
    },
  }
</script>

 <style lang="stylus" rel="stylesheet/stylus" scoped>
  .main_wrapper
    width 100%
    background #fff
    border-radius 8px

  .page-space > *
    margin-bottom 15px

  .selected
    background-color #20a0ff
    color #fff

  .value
    font-size 20px
    margin-top 12px
    margin-bottom 15px
    color #121315

  .picArea
    margin 20px
    overflow auto
    .picItem
      border 1px solid #d1dbe5
      padding 20px
      &:not(:first-child)
        margin-top 20px
      .timeTarget > div
        vertical-align middle
</style>
