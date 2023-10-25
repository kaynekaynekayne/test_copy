<template>
  <div class="mt-2" id="divOrderList">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <b-row>
        <b-col>
          <div id="title" class="panelTitle">Order List</div>
        </b-col>
        <!-- <b-col class="text-right">
          <img class="pointer" src="~@/assets/test/ic_add_circle_outline_white_48dp.png" @click="onAddOrder" style="width: 25px;"/>
        </b-col> -->
      </b-row>
      <b-row class="mt-4">
        <b-col>
          <div class="h-100" style="overflow: auto;">
            <table class="w-100" id="orderTable">
              <tr class="border-bottom borderColorGray">
                <th class="pb-3 text-center" style="width: 40px;"></th>
                <th v-for="field in fileds" class="pb-2 text-center" style="font-size: 13px; font-weight: bold;">
                  {{ field }}
                </th>
              </tr>
              <tr v-for="(item, index) in dspOrderList" :key="index" style="font-size: 13px;">
                <td class="text-center border-right borderColorGray colorWhite" style="width: 40px;">{{ index + 1 }}</td>
                <td class="text-center colorWhite">{{ item.barcodeNo }}</td>
                <td class="text-center colorWhite">{{ item.patientNm }}</td>
                <td class="text-center colorWhite">{{ $stringToDateTime(item.orderDttm) }}</td>
                <td class="text-center colorWhite">{{ getCommonCode('14', item.stateCd).cdNm }}</td>
              </tr>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import lodash from 'lodash'

  export default {
    name: 'order-list',
    computed: {
      ...mapGetters({
        getOrderList: Constant.GET_ORDER_LIST,
        getCommonCode: Constant.GET_COMMON_CODE,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    watch: {
      backendData: function(newVal, oldVal) {
        if (this.backendData.jobCmd === 'RUNNING_INFO') {
          this.dspOrderList = this.backendData.slotInfo
        }
      }
    },
    data () {
      return {
        fileds: ['Barcode ID', 'Patient Name', 'Order Date', 'State'],
        dspOrderList: []
      }
    },
    beforeDestroy () {
      this.EventBus.$off('CHANGE_USER')
      // this.EventBus.$off('RECEIVE_DATA')
    },
    mounted () {
      var self = this

      if (!this.$store.getters.getRunningState) {
        self.dspOrderList = []
      }

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.dspOrderList = []
      })

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //
      //   if (jobCmd === 'RUNNING_INFO') {
      //     self.dspOrderList = params.slotInfo
      //   }
      // })
    }
  }
</script>
<style>
  #divOrderList {
    height: 362px;
  }
</style>
