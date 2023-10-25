<template>
  <div id="rowMagnificationImage">

    <!-- <viewer id="rowMagViewer"
      :images="lowImages"
      :options="lowMagnificationOptions"
      @inited="inited"
      ref="viewer"
      style="text-align: center; height: 100%; overflow: hidden;">
      <img class="wbcImage p-1" v-for="(image, index) in lowImages"
        :src="image" :key="index" style="width: 100%;" />
    </viewer> -->
    <img class="wbcImage p-1" v-for="(image, index) in lowImages"
      :src="image" :key="index" style="width: 50%; display: none;" />
    <div id="divDefaultRatio250" class="pointer" @click="onClickRatio250">x250</div>
    <div id="divDefaultRatio" class="pointer" @click="onClickRatio1000">x1000</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'

  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'row-magnification-image',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        orderId: Constant.GET_SELECT_ORDER_ID
      })
    },
    watch: {
      orderId: function(newVal, oldVal) {
        console.log(newVal, oldVal)
        this.initElement()
      }
    },
    props: ['lowMagViewer'],
    data () {
      return {
        lowImages: [],
        // lowMagnificationOptions: {
        //   inline: true,
        //   minZoomRatio: 0.1,
        //   maxZoomRatio: 4,
        //   tooltip: false,
        //   viewed (e) {
        //     console.log('viewed')
        //     var viewPercent = document.createElement('div')
        //     viewPercent.id = 'viewPercent'
        //
        //     document.getElementById('rowMagnificationImage').appendChild(viewPercent)
        //   },
        //   zoom (e) {
        //     var ratio = (1000 / 280) * 100
        //     var curRatio = e.detail.ratio * 100
        //     var realRatio = (curRatio * (ratio / 100)).toFixed(0)
        //
        //     console.log(this.viewer)
        //     document.getElementById('viewPercent').innerHTML = realRatio + '%'
        //     document.getElementById('viewPercent').style.visibility = 'visible'
        //
        //     this.viewer.canvas.appendChild(document.getElementById('viewPercent'))
        //   },
        //   zoomed (e) {
        //     setTimeout(function() {
        //       document.getElementById('viewPercent').style.visibility = 'hidden'
        //     }, 500)
        //   }
        // },
        tabIndex: 0,
        filterExp: /^.png|.jpg|.bmp$/
      }
    },
    beforeDestory () {
      this.EventBus.$off('SLIDE_STATE_CHANGE')
    },
    mounted () {
      var self = this

      this.initElement()
      this.EventBus.$on('SLIDE_STATE_CHANGE', function(state) {
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'))
        }, 10)
      })
    },
    methods: {
      initElement() {
        var self = this

        try {
          var rootPath = this.settings.pbiaRootPath + '/' + this.orderId
          var slotDirList = fs.readdirSync(rootPath)
          var magnificationPath = null

          console.log(rootPath)
          // low magnification
          for (var i = 0; i < slotDirList.length; i++) {
            if (slotDirList[i].includes(this.settings.rbcImageDirName)) {
              magnificationPath = rootPath + '/' + slotDirList[i]
            }
          }

          var files = fs.readdirSync(magnificationPath).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase())
          })

          this.lowImages = []
          for (var i = 0; i < files.length; i++) {
            this.lowImages.push('file://' + magnificationPath + '/' + files[i])
          }
        } catch (err) {
          this.$modal.show(ModalInfo, {code: err.code, message: err.message, path: '/homePage/result'}, {
            height: 'auto',
            width: '550px'
          })
        }
      },
      inited(viewer) {
        console.log('----inited----')
        // this.$viewer = viewer
        //
        // this.$nextTick(function () {
        //   console.log(this.$viewer)
        //   console.log(this.$viewer.tooltip())
        //   console.log(this.$viewer.canvas)
        // })
      },
      onClickRatio250 (evt) {
        // this.$viewer.zoomTo(2.8)
        this.lowMagViewer.zoomTo(0.7)
      },
      onClickRatio1000 (evt) {
        // this.$viewer.zoomTo(2.8)
        this.lowMagViewer.zoomTo(2.8)
      },
    }
  }
</script>

<style>
  #rowMagnificationImage {
    height: 750px;
    position: relative;
  }
  #viewPercent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: black;
    border-radius: 20px;
    padding: 2px 5px 2px 5px;
    font-size: 12px;
    text-align: center;
    opacity: 0.7;
    visibility: hidden;
    width: 50px;
    height: 20px;
    line-height: 17px;
  }
  #divDefaultRatio {
    position: absolute;
    bottom: 7%;
    left: 7%;
    background-color: black;
    border-radius: 5px;
    padding: 2px 5px 2px 5px;
    font-size: 12px;
    text-align: center;
    opacity: 0.7;
    z-index: 99999;
    width: 50px;
  }
  #divDefaultRatio250 {
    position: absolute;
    bottom: 7%;
    left: 2%;
    background-color: black;
    border-radius: 5px;
    padding: 2px 5px 2px 5px;
    font-size: 12px;
    text-align: center;
    opacity: 0.7;
    z-index: 99999;
    width: 50px;
  }
</style>
