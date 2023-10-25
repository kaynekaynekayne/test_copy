<template>
  <b-container id="finalReport" class="pl-0" fluid>
    <b-row>
      <b-col v-show="isShowRbc" class="p-0 pr-1 pl-1" cols="3">
        <rbc-classification :param-item="paramItem"></rbc-classification>
      </b-col>
      <b-col class="p-0 pr-1 pl-1" cols="3">
        <wbc-classification :param-item="paramItem"></wbc-classification>
      </b-col>
      <b-col class="p-0 pl-3">
        <report :param-item="paramItem"></report>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import RbcClassification from './RbcComponents/RbcClassification'
  import WbcClassification from './WbcComponents/WbcClassification'
  import Report from './FinalReportComponents/Report'
  import Constant from '../../../../Constant'
  import { mapGetters } from 'vuex'

  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'final-report-page',
    components: { RbcClassification, WbcClassification, Report },
    computed: {
      ...mapGetters({
        // orderId: Constant.GET_SELECT_ORDER_ID
      })
    },
    watch: {
      // orderId: function(newVal, oldVal) {
      //   console.log(newVal, oldVal)
      // }
    },
    data () {
      return {
        paramItem: null,
        isShowRbc: false
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      this.EventBus.$off('UPDATE_FINAL_REPORT')
    },
    mounted () {
      var self = this

      // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.$route.params.orderNo}))
      // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
      //   console.log(result)
      //   self.paramItem = result
      //   if (self.paramItem.TEST_TYPE === '01' || self.paramItem.TEST_TYPE === '04') {
      //     self.isShowRbc = true
      //   } else {
      //     self.isShowRbc = false
      //   }
      // })
      this.EventBus.$on('UPDATE_FINAL_REPORT', function(params) {
        self.paramItem = params
        console.log(params)
        if (self.paramItem.TEST_TYPE === '01' || self.paramItem.TEST_TYPE === '04') {
          self.isShowRbc = true
        } else {
          self.isShowRbc = false
        }
      })

    }
  }
</script>
<style>
</style>
