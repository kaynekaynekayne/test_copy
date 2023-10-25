<template>
  <b-container id="wbcReport" class="p-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1 pl-1" cols="3">
          <wbc-classification :param-item="paramItem"></wbc-classification>
        </b-col>
      </transition>
      <b-col class="p-0 pr-1 pl-1">
        <wbc-result-image-list :param-item="paramItem"></wbc-result-image-list>
      </b-col>
    </b-row>
    <!-- <img v-if="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-else class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import WbcClassification from './WbcComponents/WbcClassification'
  import WbcResultImageList from './WbcComponents/WbcResultImageList'
  import Constant from '../../../../Constant'

  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'wbc-report-page',
    components: { WbcClassification, WbcResultImageList },
    ...mapGetters({
      orderId: Constant.GET_SELECT_ORDER_ID
    }),
    data () {
      return {
        isSideShow: true,
        paramItem: null
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      this.EventBus.$off('UPDATE_WBC_REPORT')
    },
    beforeCreate () {
      var self = this
      console.log('UPDATE_WBC_REPORT beforeCreate')

      this.EventBus.$on('UPDATE_WBC_REPORT', function(params) {
        console.log('recv UPDATE_WBC_REPORT')
        console.log(params)
        self.paramItem = params
      })

      // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.$route.params.orderNo}))
      // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
      //   console.log(result)
      //   self.paramItem = result
      // })
    },
    methods: {
      onSideClose (evt) {
        this.isSideShow = false
      },
      onSideOpen (evt) {
        this.isSideShow = true
      },
      afterEnter (el, done) {
        this.EventBus.$emit('SLIDE_STATE_CHANGE', this.isSideShow)
      },
      afterLeave (el, done) {
        this.EventBus.$emit('SLIDE_STATE_CHANGE', this.isSideShow)
      }
    }
  }
</script>

<style>
  #functionTitle {
    font-size: 11px;
    color: green;
  }
  #classWbcTab {
    color: black;
  }
</style>
