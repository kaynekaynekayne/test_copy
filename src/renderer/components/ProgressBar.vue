<template>
  <div class="progressBar">
    <div id="bar" style="-webkit-app-region: no-drag;">
        <div id="barContent"></div>
        <img v-if="isInit == 'N'" id="progressIcon" @click="sendIntialize" src="~@/assets/icon/init.png" class="border pointer"/>
        <img v-else-if="isPause" id="progressIcon" @click="reStart" src="~@/assets/icon/start.png" class="border pointer"/>
        <img v-else-if="userStop && !isRecoveryRun" id="progressIcon" @click="start" src="~@/assets/icon/recovery.png" class="border pointer"/>
        <img v-else-if="userStop && isRecoveryRun" id="progressIcon" src="~@/assets/icon/recovery_off.png" class="border pointer"/>
        <img v-else-if="isRunningState" id="progressIcon" @click="stop" src="~@/assets/icon/stop.png" class="border pointer"/>
        <img v-else id="progressIcon" @click="start" src="~@/assets/icon/start.png" class="border pointer"/>

        <!-- <img v-if="eqStatCd == '02'" id="progressIcon" @click="" src="~@/assets/icon/start.png" class="border pointer"/>
        <img v-if="eqStatCd == '03'" id="progressIcon" @click="" src="~@/assets/icon/start.png" class="border pointer"/>
        <img v-if="eqStatCd == '04'" id="progressIcon" @click="" src="~@/assets/icon/stop.png" class="border pointer"/> -->
    </div>
    <div v-if="eqStatCd == '01'" id="barText">
      <label>IDLE</label>
    </div>
    <div v-if="eqStatCd == '02'" id="barText">
      <label>READY</label>
    </div>
    <div v-if="eqStatCd == '03'" id="barText">
      <label>ERROR</label>
    </div>
    <div v-if="eqStatCd == '04'" id="barText">
      <label>{{ percent }} %</label>
    </div>
    <div v-if="eqStatCd == '05'" id="barText" style="left: 60px;">
      <label>INITALIZING</label>
    </div>
    <!-- <div id="barStorage">
      <div id="barStorageContent" class="pl-4 pt-1">
      </div>
      <div id="storageBarText">
        <label>storage - {{ storagePercent }} %</label>
      </div>
    </div> -->
  </div>
</template>

<script>
  import Constant from '../../Constant'
  import { mapGetters } from 'vuex'
  import worker from '../workers/promise'
  import ModalConfirm from './Common/ModalConfirm'

  export default {
    name: 'progress-bar',
    computed: {
      ...mapGetters({
        orderList: Constant.GET_ORDER_LIST_BM,
        currentUser: Constant.GET_CURRENT_USER,
        isRunningState: Constant.GET_RUNNING_STATE,
        settings: Constant.GET_SETTINGS,
        isPause: Constant.GET_PAUSE_STATE,
        userStop: Constant.GET_USER_STOP,
        isRecoveryRun: Constant.GET_IS_RECOVERY_RUN,
        sysInfo: Constant.GET_SYS_INFO,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    watch: {
      backendData: function(newVal, oldVal) {
        var self = this

        if (self.backendData.jobCmd === 'INIT') {
          self.isInit = 'Y'

        } else if (self.backendData.jobCmd === 'RUNNING_INFO') {
          self.progressMax = 0
          self.progressValue = 0

          self.backendData.slotInfo.forEach(function(item) {
            if (item.stateCd !== '00') {
              self.progressMax++
            }

            if (item.stateCd === '04') {
              self.progressValue++
            }
          })

          console.log(self.progressMax)
          console.log(self.progressValue)

          if (self.progressValue >= self.progressMax) {
            self.progressValue = self.progressMax
          }

          self.percent = ((self.progressValue / self.progressMax) * 100).toFixed(0)

          var width = Number((180 * (Number(self.percent) / 100)).toFixed(0))
          if (width < 28) { width += 28 }

          document.getElementById('barContent').style.width = width + 'px'
          document.getElementById('barContent').style.backgroundColor = '#0080C1'
        }
      },
      sysInfo: function(newVal, oldVal) {
        var self = this

        self.eqStatCd = self.sysInfo.eqStatCd
        self.isInit = self.sysInfo.isInit
        self.storagePercent = self.sysInfo.storageSize

        // isRecovery 추가
        if (self.sysInfo.isRecovery === 'Y') {
          self.$store.dispatch(Constant.SET_USER_STOP, true)
        } else {
          self.$store.dispatch(Constant.SET_IS_RECOVERY_RUN, false)
          self.$store.dispatch(Constant.SET_USER_STOP, false)
        }
      }
    },
    beforeDestroy () {
      console.log('progress destory------')
      // this.EventBus.$off('RECEIVE_DATA_PROGRESS')
      // this.EventBus.$off('RECEIVE_DATA_PROGRESS_SYSINFO')
      this.EventBus.$off('RECOVER_GRIPPER')
    },
    data () {
      return {
        progressMax: 0,
        progressValue: 0,
        percent: 0,
        bmNo: '',
        eqStatCd: '01',
        isInit: 'N',
        storagePercent: '0'
      }
    },
    mounted () {
      console.log('progress mounted------')
      var self = this

      // this.EventBus.$on('RECEIVE_DATA_PROGRESS_SYSINFO', function(params) {
      //   self.eqStatCd = params.eqStatCd
      //   self.isInit = params.isInit
      //   self.storagePercent = params.storageSize
      //
      //   // isRecovery 추가
      //   if (params.isRecovery === 'Y') {
      //     self.$store.dispatch(Constant.SET_USER_STOP, true)
      //   } else {
      //     self.$store.dispatch(Constant.SET_IS_RECOVERY_RUN, false)
      //     self.$store.dispatch(Constant.SET_USER_STOP, false)
      //   }
      // })

      // this.EventBus.$on('RECEIVE_DATA_PROGRESS', function(params) {
      //   var jobCmd = params.jobCmd
      //
      //   if (jobCmd === 'INIT') {
      //     self.isInit = 'Y'
      //
      //   } else if (jobCmd === 'RUNNING_INFO') {
      //     self.progressMax = 0
      //     self.progressValue = 0
      //
      //     params.slotInfo.forEach(function(item) {
      //       if (item.stateCd !== '00') {
      //         self.progressMax++
      //       }
      //
      //       if (item.stateCd === '04') {
      //         self.progressValue++
      //       }
      //     })
      //
      //     console.log(self.progressMax)
      //     console.log(self.progressValue)
      //
      //     if (self.progressValue >= self.progressMax) {
      //       self.progressValue = self.progressMax
      //     }
      //
      //     self.percent = ((self.progressValue / self.progressMax) * 100).toFixed(0)
      //
      //     var width = Number((180 * (Number(self.percent) / 100)).toFixed(0))
      //     if (width < 28) { width += 28 }
      //
      //     document.getElementById('barContent').style.width = width + 'px'
      //     document.getElementById('barContent').style.backgroundColor = '#0080C1'
      //   }
      // })

      this.EventBus.$on('RECOVER_GRIPPER', function(params) {
        console.log(params)
        self.sendRecover()
      })
    },
    methods: {
      // 초기화
      sendIntialize () {
        console.log('sendIntialize')
        var params = {
          jobCmd: 'INIT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        // this.EventBus.$emit('OVERLAY', {state: true})
      },
      // 재실행
      sendReStart() {
        var params = {
          jobCmd: 'RESTART',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          bfSelectFiles: this.bfSelectFiles
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 실행
      sendStart () {
        var params = {
          jobCmd: 'START',
          reqUserId: this.currentUser.userId,
          testType: this.settings.testTypeCd,
          wbcCount: this.settings.pbAnalysisType,
          stitchCount: this.settings.stitchCount,
          runningMode: this.settings.runningMode,
          positionMargin: this.settings.positionMargin,
          reqDttm: this.$getDateTimeStr()
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))

        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : START]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      reStart (evt) {
        this.sendReStart()
        this.$store.dispatch(Constant.SET_PAUSE_STATE, false)
      },
      start (evt) {
        var self = this

        // 실행 여부 체크
        if (self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // recovery필요 여부 체크
        if (self.userStop) {
          self.$modal.show(ModalConfirm, {openType: 'userStop', message: Constant.IDS_RECOVER_GRIPPER_CONDITION}, {
            height: 'auto',
            width: '350px'
          })

          return
        }

        // 초기화 여부 체크
        setTimeout(function() {
          if (self.isInit === 'Y') {
            self.$store.dispatch(Constant.INIT_ORDER_LIST, null)
            self.sendStart()
          } else {
            self.$toasted.show(Constant.IDS_MSG_INITALIZE, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        }, 0)
      },
      stop (evt) {
        var self = this

        if (!self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_STOP_PROCESS, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // 종료
        var params = {
          jobCmd: 'STOP',
          reqUserId: self.currentUser.userId,
          reqDttm: self.$getDateTimeStr(),
          isEmergency: 'N',
          isUserStop: 'Y'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        self.$store.dispatch(Constant.SET_USER_STOP, true)

        // seve logs
        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : STOP]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      sendRecover () {
        var self = this

        // 종료
        var params = {
          jobCmd: 'RECOVERY',
          reqUserId: self.currentUser.userId,
          reqDttm: self.$getDateTimeStr()
        }

        // recovery 비활성화
        self.$store.dispatch(Constant.SET_IS_RECOVERY_RUN, true)
        worker.sendDataToServer(this, JSON.stringify(params))
        // self.EventBus.$emit('OVERLAY', {state: true})
      }
    }
  }
</script>

<style>
  #progressIcon {
    width: 28px;
    height: 28px;
    border-radius: 50px;
    position: absolute;
    background-color: #010101;
    left: 0;
  }
  #bar {
    width: 181px;
    height: 30px;
    border: 1px solid;
    padding-left: 10px;
    border-left: none;
    border-radius: 50px;
    float: left;
    position: relative;
    margin-top: 25px;
  }
  #barText {
    /* right: 90px; */
    left: 80px;
    top: 31px;
    font-size: 12px;
    position: absolute;
  }
  #barContent {
    height: 28px;
    border-radius: 50px;
    position: absolute;
    top: 0;
    left: 0;
  }
  #barStorage {
    width: 181px;
    height: 30px;
    border: 1px solid;
    padding-left: 10px;
    border-radius: 50px;
    position: relative;
    float: left;
    margin-top: 25px;
    margin-left: 30px;
  }
  #barStorageContent {
    height: 28px;
    border-radius: 50px;
    position: absolute;
    top: 0;
    left: 0;
  }
  #storageBarText {
    left: 30px;
    top: 5px;
    font-size: 12px;
    position: absolute;
  }
</style>
