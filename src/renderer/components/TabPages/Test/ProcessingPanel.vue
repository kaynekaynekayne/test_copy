<template>
  <div id="processingPanel">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <div class="panelTitle">Working View</div>
        <!-- <Progress
          class="text-center mt-4"
          :transitionDuration="300"
          :radius="110"
          :strokeWidth="10"
          :value="progressValue"
          strokeColor="#3B86FF">
          <div class="content">
            <div v-if="eqStatCd === '01'" style="font-size: 18px;">IDLE</div>
            <div v-if="eqStatCd === '02'" style="font-size: 18px;">READY</div>
            <div v-if="eqStatCd === '03'" style="font-size: 18px;">ERROR</div>
            <div v-if="eqStatCd === '04'" style="font-size: 18px;">RUNNING</div>
            <div style="font-size: 18px;">{{ wbcCount }}</div>
            <div style="font-size: 12px; color: #2798DC;">Number of WBCs</div>
            <div id="slideTimer">{{ slideTime }}</div>
          </div>
        </Progress> -->
        <vue-circle ref="workingProgress"
          class="text-center mt-4"
          :progress="0"
          :size="250"
          :reverse="false"
          line-cap="round"
          :fill="fill"
          empty-fill="#264478"
          :animation="{ duration: 300, easing: 'circleProgressEasing' }"
          :animation-start-value="0.0"
          :start-angle="0"
          insert-mode="append"
          :thickness="10"
          :show-percent="false">
          <div class="content">
            <div v-if="eqStatCd === '01'" style="font-size: 18px;">IDLE</div>
            <div v-if="eqStatCd === '02'" style="font-size: 18px;">READY</div>
            <div v-if="eqStatCd === '03'" style="font-size: 18px;">ERROR</div>
            <div v-if="eqStatCd === '04'" style="font-size: 18px;">RUNNING</div>
            <div v-if="eqStatCd === '05'" style="font-size: 18px;">INITIALIZATION</div>
            <div style="font-size: 18px;">{{ wbcCount }}</div>
            <div style="font-size: 12px; color: #2798DC;">Number of WBCs</div>
            <div id="slideTimer">{{ slideTime }}</div>
          </div>
        </vue-circle>

        <div class="mt-2">
          <b-row>
            <b-col cols="2">
              <img src="~@/assets/test/ic_access_time_white_48dp.png" style="width: 25px;"/>
            </b-col>
            <b-col>
              <span id="timer" class="mt-2" style="font-size: 16px;">{{ time }}</span>
            </b-col>
          </b-row>
        </div>
        <div id="slot" class="mt-2">
          <b-row class="p-0">
            <!-- input -->
            <b-col class="p-1 pl-2 text-center">
              <b-card class="slideCard p-1" no-body>
                <div v-for="inputSlot in slotInfo.input" style="margin-top: 13px;">
                  <div v-if="inputSlot.slotState === '0'" id="slotInfo" style="height: 12px; background-color: #4D4F5C; border-radius: 5px;">
                  </div>
                  <div v-else-if="inputSlot.slotState === '1'" id="slotInfo" style="height: 12px; background-color: #37B9C8; border-radius: 5px;">
                  </div>
                  <div v-else-if="inputSlot.slotState === '2'" id="slotInfo" class="runningSlot flickerOff" style="height: 12px; border-radius: 5px;">
                  </div>
                  <div v-else-if="inputSlot.slotState === '3'" id="slotInfo" style="height: 12px; background-color: #2A5A98; border-radius: 5px;">
                  </div>
                  <div v-else-if="inputSlot.slotState === '4'" id="slotInfo" style="height: 12px; background-color: #A73A3A; border-radius: 5px;">
                  </div>
                  <div v-else id="slotInfo" style="height: 12px; background-color: #4D4F5C; border-radius: 5px;">
                  </div>
                </div>
              </b-card>
              <div class="mt-2">Input</div>
            </b-col>
            <!-- output -->
            <b-col class="p-1 pr-2 text-center">
              <b-card class="slideCard p-1" no-body>
                <div v-for="outputSlot in slotInfo.output" style="margin-top: 13px;">
                  <div v-if="outputSlot.slotState === '0'" id="slotInfo" style="height: 12px; background-color: #4D4F5C; border-radius: 5px;">
                  </div>
                  <div v-else-if="outputSlot.slotState === '1'" id="slotInfo" style="height: 12px; background-color: #37B9C8; border-radius: 5px;">
                  </div>
                  <div v-else id="slotInfo" style="height: 12px; background-color: #4D4F5C; border-radius: 5px;">
                  </div>
                </div>
              </b-card>
              <div class="mt-2">Output</div>
            </b-col>
          </b-row>
        </div>

        <!-- <span id="timer">{{ time }}</span> -->

      <!-- <div class="panelTitle">WORKING VIEW</div>
      <div class="mt-3">
        <div class="panelSubTitleBlue">Running time</div>
        <div>
          <span id="timer">{{ time }}</span>
        </div>
      </div>
      <div class="panelSubTitleBlue mt-3">Lastest found WBCs</div>
      <div>
        <span id="timer">{{ progressValue }}</span>count
        <progress class="wbcProgress" :value="progressValue" :max="progressMax"></progress>
      </div>
      <div class="panelSubTitleBlue mt-5">PROCESSING INFORMATION</div>
      <div class="mt-2" style="overflow-y: auto; overflow-x: hidden;">
        <b-row v-for="item in processingStateList" :key="item.id">
          <b-col cols="1">
            <img v-if="item.state" src="~@/assets/test/ic_done_white_48dp.png" style="width: 25px;" />
            <img v-else src="~@/assets/test/ic_done_black_48dp.png" style="width: 25px;" />
          </b-col>
          <b-col>
            <div>{{ item.cdNm }}</div>
          </b-col>
        </b-row>
      </div> -->
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  // import Progress from 'easy-circular-progress'
  import VueCircle from 'vue2-circle-progress'

  export default {
    name: 'processing-panel',
    components: { VueCircle },
    computed: {
      ...mapGetters({
        commonCodeList: Constant.GET_COMMON_CODE_LIST,
        timerId: Constant.GET_WORKING_INTERVAL_ID,
        sysInfo: Constant.GET_SYS_INFO,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    watch: {
      sysInfo: function(newVal, oldVal) {
        this.eqStatCd = this.sysInfo.eqStatCd
        if (!this.isRunning) {
          // input 슬롯 상태 변경
          for (var j = 0; j < this.slotInfo.input.length; j++) {
            this.slotInfo.input[j].slotState = this.sysInfo.iCasStat.charAt(j)
          }
          // output 슬롯 상태 변경
          for (var k = 0; k < this.slotInfo.output.length; k++) {
            this.slotInfo.output[k].slotState = this.sysInfo.oCasStat.charAt(k)
          }
        }
      },
      backendData: function(newVal, oldVal) {
        var self = this

        if (self.backendData.jobCmd === 'RUNNING_INFO') {
          self.isRunning = true

          var currentSlot = self.backendData.slotInfo.find(function (item) {
            return item.stateCd === '03'
          })

          if (typeof(currentSlot) !== 'undefined') {
            var progressMax = Number(currentSlot.maxWbcCount)
            self.wbcCount = Number(currentSlot.wbcCount)

            if (self.wbcCount > progressMax) {
              self.wbcCount = progressMax
            }

            var progressValue = ((self.wbcCount / progressMax) * 100).toFixed(2)
            self.$refs.workingProgress.updateProgress(Number(progressValue))
          }

          // input 슬롯 상태 변경
          for (var j = 0; j < self.slotInfo.input.length; j++) {
            self.slotInfo.input[j].slotState = self.backendData.iCasStat.charAt(j)
          }
          // output 슬롯 상태 변경
          for (var k = 0; k < self.slotInfo.output.length; k++) {
            self.slotInfo.output[k].slotState = self.backendData.oCasStat.charAt(k)
          }

        } else if (self.backendData.jobCmd === 'RUNNING_COMP') {
          self.stopTimer()
        } else if (self.backendData.jobCmd === 'STOP') {
          self.isRunning = false
          self.stopTimer()
        }
      }
    },
    data () {
      return {
        fill : { gradient: ["#3B86FF"] },
        // progressValue: 0,
        // progressMax: 100,
        time: '',
        slideTime: '',
        iSlotState: '',
        eqStatCd: '01',
        wbcCount: 0,
        slotInfo: {
          input: [
            {slotNo: 1, slotState: '0'},
            {slotNo: 2, slotState: '0'},
            {slotNo: 3, slotState: '0'},
            {slotNo: 4, slotState: '0'},
            {slotNo: 5, slotState: '0'},
            {slotNo: 6, slotState: '0'},
            {slotNo: 7, slotState: '0'},
            {slotNo: 8, slotState: '0'},
            {slotNo: 9, slotState: '0'},
            {slotNo: 10, slotState: '0'},
            {slotNo: 11, slotState: '0'},
            {slotNo: 12, slotState: '0'}
          ],
          output: [
            {slotNo: 1, slotState: '0'},
            {slotNo: 2, slotState: '0'},
            {slotNo: 3, slotState: '0'},
            {slotNo: 4, slotState: '0'},
            {slotNo: 5, slotState: '0'},
            {slotNo: 6, slotState: '0'},
            {slotNo: 7, slotState: '0'},
            {slotNo: 8, slotState: '0'},
            {slotNo: 9, slotState: '0'},
            {slotNo: 10, slotState: '0'},
            {slotNo: 11, slotState: '0'},
            {slotNo: 12, slotState: '0'}
          ]
        },
        isRunning: false
      }
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off('CHANGE_USER')
      // this.EventBus.$off('RECEIVE_DATA')
      // this.EventBus.$off('RECEIVE_DATA_SYSINFO')
      this.EventBus.$off('CHANGE_SLIDE')
      this.EventBus.$off('DRAW_TIMER')

    },
    mounted () {
      var self = this

      this.initElement()
      this.EventBus.$on('CHANGE_USER', function(params) {
        self.$refs.workingProgress.updateProgress(0)
        self.eqStatCd = '01'
        self.wbcCount = 0
        self.slotInfo = {
          input: [
            {slotNo: 1, slotState: '0'},
            {slotNo: 2, slotState: '0'},
            {slotNo: 3, slotState: '0'},
            {slotNo: 4, slotState: '0'},
            {slotNo: 5, slotState: '0'},
            {slotNo: 6, slotState: '0'},
            {slotNo: 7, slotState: '0'},
            {slotNo: 8, slotState: '0'},
            {slotNo: 9, slotState: '0'},
            {slotNo: 10, slotState: '0'},
            {slotNo: 11, slotState: '0'},
            {slotNo: 12, slotState: '0'}
          ],
          output: [
            {slotNo: 1, slotState: '0'},
            {slotNo: 2, slotState: '0'},
            {slotNo: 3, slotState: '0'},
            {slotNo: 4, slotState: '0'},
            {slotNo: 5, slotState: '0'},
            {slotNo: 6, slotState: '0'},
            {slotNo: 7, slotState: '0'},
            {slotNo: 8, slotState: '0'},
            {slotNo: 9, slotState: '0'},
            {slotNo: 10, slotState: '0'},
            {slotNo: 11, slotState: '0'},
            {slotNo: 12, slotState: '0'}
          ]
        }

        // Working timer 초기화
        self.initElement()
        self.time = self.getCountToTime(0)
        self.slideTime = self.getCountToTime(0)

        document.getElementById('timer').innerHTML = self.time
        document.getElementById('slideTimer').innerHTML = self.slideTime
      })

      this.EventBus.$on('DRAW_TIMER', function(params) {
        self.drawTimer()
      })

      this.EventBus.$on('CHANGE_SLIDE', function(params) {
        self.slideTime = self.getCountToTime(JSON.parse(JSON.stringify(self.$store.getters.getSlideTimeCount)))
      })

      // this.EventBus.$on('RECEIVE_DATA_SYSINFO', function(params) {
      //   self.eqStatCd = params.eqStatCd
      //
      //   console.log(params)
      //   if (!self.isRunning) {
      //     // input 슬롯 상태 변경
      //     for (var j = 0; j < self.slotInfo.input.length; j++) {
      //       self.slotInfo.input[j].slotState = params.iCasStat.charAt(j)
      //     }
      //     // output 슬롯 상태 변경
      //     for (var k = 0; k < self.slotInfo.output.length; k++) {
      //       self.slotInfo.output[k].slotState = params.oCasStat.charAt(k)
      //     }
      //   }
      // })

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //
      //   if (jobCmd === 'RUNNING_INFO') {
      //     self.isRunning = true
      //
      //     var currentSlot = params.slotInfo.find(function (item) {
      //       return item.stateCd === '03'
      //     })
      //
      //     if (typeof(currentSlot) !== 'undefined') {
      //       var progressMax = Number(currentSlot.maxWbcCount)
      //       self.wbcCount = Number(currentSlot.wbcCount)
      //
      //       if (self.wbcCount > progressMax) {
      //         self.wbcCount = progressMax
      //       }
      //
      //       var progressValue = ((self.wbcCount / progressMax) * 100).toFixed(2)
      //       self.$refs.workingProgress.updateProgress(Number(progressValue))
      //     }
      //
      //     // input 슬롯 상태 변경
      //     for (var j = 0; j < self.slotInfo.input.length; j++) {
      //       self.slotInfo.input[j].slotState = params.iCasStat.charAt(j)
      //     }
      //     // output 슬롯 상태 변경
      //     for (var k = 0; k < self.slotInfo.output.length; k++) {
      //       self.slotInfo.output[k].slotState = params.oCasStat.charAt(k)
      //     }
      //
      //   } else if (jobCmd === 'RUNNING_COMP') {
      //     self.stopTimer()
      //   } else if (jobCmd === 'STOP') {
      //     self.isRunning = false
      //     self.stopTimer()
      //   }
      // })
    },
    methods: {
      initElement () {
        if (!this.$store.getters.getRunningState) {
          this.$store.dispatch(Constant.SET_TIMER, 0)
          this.$store.dispatch(Constant.SET_SLIDE_TIMER, 0)
        }

        // 2022_12_12_LBK
        this.drawTimer()
      },
      drawTimer () {
        this.time = this.getCountToTime(JSON.parse(JSON.stringify(this.$store.getters.getWorkingTimer)))
        this.slideTime = this.getCountToTime(JSON.parse(JSON.stringify(this.$store.getters.getSlideTimeCount)))

        if (document.getElementById('timer') !== null) {
          document.getElementById('timer').innerHTML = this.time
        }

        // test화면 resume시 타이머 표시
        if (document.getElementById('slideTimer') !== null) {
          document.getElementById('slideTimer').innerHTML = this.slideTime
        }

        // flicking
        if (document.getElementsByClassName('runningSlot').length > 0) {
          this.toggleClass(document.getElementsByClassName('runningSlot')[0], this.isFlicking = !this.isFlicking)
        }
      },
      getCountToTime (timeCount) {
        var hour = parseInt(timeCount / 3600)
        var minutes = parseInt((timeCount % 3600) / 60)
        var secondes = parseInt((timeCount % 3600) % 60)

        return this.pad(hour, 2) + ':' + this.pad(minutes, 2) + ':' + this.pad(secondes, 2)
      },
      pad (n, width) {
        n = n + ''
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
      },
      startTimer() {
        var self = this
        var timerId = null

        self.$store.dispatch(Constant.SET_TIMER, 0)
        self.$store.dispatch(Constant.SET_SLIDE_TIMER, 0)

        timerId = setInterval(function() {
          self.$store.dispatch(Constant.UPDATE_TIMER)
          self.$store.dispatch(Constant.UPDATE_SLIDE_TIMER)
          self.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, timerId)

          self.time = self.getCountToTime(JSON.parse(JSON.stringify(self.$store.getters.getWorkingTimer)))
          self.slideTime = self.getCountToTime(JSON.parse(JSON.stringify(self.$store.getters.getSlideTimeCount)))

          if (document.getElementById('timer') !== null) {
            document.getElementById('timer').innerHTML = self.time
          }

          // test화면 resume시 타이머 표시
          if (document.getElementById('slideTimer') !== null) {
            document.getElementById('slideTimer').innerHTML = self.slideTime
          }

          // flicking
          if (document.getElementsByClassName('runningSlot').length > 0) {
            self.toggleClass(document.getElementsByClassName('runningSlot')[0], self.isFlicking = !self.isFlicking)
          }
        }.bind(this), 1000)
      },
      stopTimer () {
        var self = this

        self.EventBus.$emit('OVERLAY', {state: true})
        setTimeout(function () {
          self.EventBus.$emit('OVERLAY', {state: false})

          clearInterval(self.timerId)
          self.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, null)
        }, 1000)
      },
      toggleClass (element, isFlicking) {
        if (isFlicking) {
          element.classList.toggle('flickerOn', true)
          element.classList.toggle('flickerOff', false)
        } else {
          element.classList.toggle('flickerOn', false)
          element.classList.toggle('flickerOff', true)
        }
      }
    }
  }
</script>
<style>
  #processingPanel {
    height: 784px;
  }
  #timer {
    font-size: 30px;
    letter-spacing: 2px;
    line-height: 28px;
  }
  .wbcProgress::-webkit-progress-value {
    background-color: #0078D7;
  }
  .slideCard {
    background-color: #283348 !important;
    height: 325px;
  }
  .flickerOn {
    background-color: #2A5A98;
  }
  .flickerOff {
    background-color: white;
  }
</style>
