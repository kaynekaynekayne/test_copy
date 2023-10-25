<template>
  <b-container id="wholeSlideReport" class="pl-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1 pl-1" cols="3">
          <whole-slide-thumbnail :param-item="paramItem"></whole-slide-thumbnail>
        </b-col>
      </transition>
      <b-col class="p-0 pr-1 pl-1">
        <whole-slide-image :param-item="paramItem"></whole-slide-image>
      </b-col>
    </b-row>
    <!-- <img v-if="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-else class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import WholeSlideThumbnail from './WholeSlideComponents/WholeSlideThumbnail'
  import WholeSlideImage from './WholeSlideComponents/WholeSlideImage'
  import Constant from '../../../../Constant'

  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'whole-slide-report-page',
    components: { WholeSlideThumbnail, WholeSlideImage },
    data () {
      return {
        isSideShow: true,
        paramItem: null
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      this.EventBus.$off('UPDATE_WHOLE_SLIDE_REPORT')
    },
    mounted () {
      var self = this

      this.EventBus.$on('UPDATE_WHOLE_SLIDE_REPORT', function(params) {
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
