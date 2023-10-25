<template>
  <div class="mt-2" id="processingInfo">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <div id="title" class="panelTitle">Processing Information</div>
      <b-row class="mt-3">
        <b-col class="panelSubTitle pl-4" cols="5">
          Cassette No
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="cassetNo" v-model="modelData.cassetNo" class="customInputBlack" type="number" readonly size="sm"></b-form-input>
            </b-col>
            <span class="mt-1">-</span>
            <b-col>
              <b-form-input id="slotNo" v-model="modelData.slotNo" class="customInputBlack" type="number" readonly size="sm"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          Barcode ID
        </b-col>
        <b-col>
          <b-form-input id="barcodeId" v-model="modelData.barcodeId" class="customInputBlack" type="text" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          Patient ID
        </b-col>
        <b-col>
          <b-form-input id="patientId" v-model="modelData.patientId" class="customInputBlack" type="text" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          Patient Name
        </b-col>
        <b-col>
          <b-form-input id="patientName" v-model="modelData.patientName" class="customInputBlack" type="text" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          WBC Count
        </b-col>
        <b-col>
          <b-form-input id="wbcCount" v-model="modelData.wbcCount" class="customInputBlack" type="text" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          Order Date
        </b-col>
        <b-col>
          <b-form-input id="orderDate" v-model="modelData.orderDate" class="customInputBlack" type="text" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4" cols="5">
          Oil Count
        </b-col>
        <b-col>
          <b-form-input id="oilCount" v-model="modelData.oilCount" class="customInputBlack" type="number" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col  class="panelSubTitle pl-4" cols="5">
          {{ modelData.currentCardName }}
        </b-col>
        <b-col>
          <b-form-input v-if="modelData.currentCardCount <= 500" id="currentCardCount" v-model="modelData.currentCardCount" class="customInputBlack" type="number" readonly size="sm" style="color: red;"></b-form-input>
          <b-form-input v-else id="currentCardCount" v-model="modelData.currentCardCount" class="customInputBlack" type="number" readonly size="sm"></b-form-input>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  export default {
    name: 'processing-info',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        sysInfo: Constant.GET_SYS_INFO,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    data () {
      return {
        modelData: {
          cassetNo: '',
          slotNo: '',
          barcodeId: '',
          patientId: '',
          patientName: '',
          wbcCount: '',
          orderDate: '',
          oilCount: '',
          currentCardName: '',
          currentCardCount: 0
        },
        testType: '01'
      }
    },
    watch: {
      sysInfo: function(newVal, oldVal) {
        this.modelData.oilCount = this.sysInfo.oilCount
        this.modelData.currentCardName = this.sysInfo.currentCardName
        this.modelData.currentCardCount = Number(this.sysInfo.currentCardCount)
      },
      backendData: function(newVal, oldVal) {
        var self = this

        if (self.backendData.jobCmd === 'RUNNING_INFO') {
          var currentSlot = self.backendData.slotInfo.find(function (item) {
            return item.stateCd === '03'
          })

          if (typeof(currentSlot) !== 'undefined') {
            self.modelData.cassetNo = 1
            self.modelData.slotNo = currentSlot.slotNo
            self.modelData.barcodeId = currentSlot.barcodeNo
            self.modelData.patientId = currentSlot.patientId
            self.modelData.patientName = currentSlot.patientNm
            self.modelData.wbcCount = currentSlot.maxWbcCount
            self.modelData.orderDate = self.$stringToDateTime(currentSlot.orderDttm)
          }
        }
      }
    },
    beforeDestroy () {
      // remove EventBus
      // this.EventBus.$off('RECEIVE_DATA_SYSINFO')
      // this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
    },
    mounted () {
      var self = this

      this.testType = this.settings.testTypeCd

      this.EventBus.$on('CHANGE_TEST_TYPE', function(params) {
        self.testType = params.testType
        console.log(self.testType)
      })

      // this.EventBus.$on('RECEIVE_DATA_SYSINFO', function(params) {
      //   self.modelData.oilCount = params.oilCount
      //   self.modelData.currentCardName = params.currentCardName
      //   self.modelData.currentCardCount = Number(params.currentCardCount)
      // })

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //
      //   if (jobCmd === 'RUNNING_INFO') {
      //     var currentSlot = params.slotInfo.find(function (item) {
      //       return item.stateCd === '03'
      //     })
      //
      //     if (typeof(currentSlot) !== 'undefined') {
      //       self.modelData.cassetNo = 1
      //       self.modelData.slotNo = currentSlot.slotNo
      //       self.modelData.barcodeId = currentSlot.barcodeNo
      //       self.modelData.patientId = currentSlot.patientId
      //       self.modelData.patientName = currentSlot.patientNm
      //       self.modelData.wbcCount = currentSlot.maxWbcCount
      //       self.modelData.orderDate = self.$stringToDateTime(currentSlot.orderDttm)
      //     }
      //   }
      // })

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.modelData.cassetNo = ''
        self.modelData.slotNo = ''
        self.modelData.barcodeId = ''
        self.modelData.patientId = ''
        self.modelData.patientName = ''
        self.modelData.wbcCount = ''
        self.modelData.orderDate = ''
        self.modelData.oilCount = ''
      })
    }
  }
</script>
<style>
</style>
