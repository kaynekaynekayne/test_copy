<template>
  <b-container id="rbcReport" class="pl-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1 pl-1" cols="3">
          <rbc-classification :param-item="paramItem"></rbc-classification>
        </b-col>
      </transition>
      <b-col class="p-0 pr-0 pl-1">
        <!-- <rbc-image-viewer></rbc-image-viewer> -->
        <rbc-tiling-viewer :param-item="paramItem"></rbc-tiling-viewer>
      </b-col>
    </b-row>
    <!-- <img v-if="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-else class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import RbcClassification from './RbcComponents/RbcClassification'
  import RbcImageViewer from './RbcComponents/RbcImageViewer'
  import RbcTilingViewer from './RbcComponents/RbcTilingViewer'
  import Constant from '../../../../Constant'

  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'rbc-report-page',
    components: { RbcClassification, RbcImageViewer, RbcTilingViewer },
    data () {
      return {
        isSideShow: true,
        paramItem: null
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      this.EventBus.$off('UPDATE_RBC_REPORT')
    },
    mounted () {
      var self = this

      // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.$route.params.orderNo}))
      // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
      //   console.log(result)
      //   self.paramItem = result
      // })

      this.EventBus.$on('UPDATE_RBC_REPORT', function(params) {
        self.paramItem = params
      })

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
  .sideClose {
    width: 30px;
    position: absolute;
    top: 8px;
    left: 360px;
  }
  .sideOpen {
    width: 30px;
    position: absolute;
    top: 8px;
    left: 0px;
  }
</style>
