<template>
  <b-container id="wholeSlideImage" fluid>
    <b-row>
      <b-col class="p-0 pt-1">
        <b-card id="wholeSlideImageCard" class="blackCard pl-4 pr-4 pt-2 pb-2" text-variant="white" no-body>
          <!-- <div id="divWholeSlideViewer">
            <viewer id="wholeSlideViewer"
              :images="wholeSlideImages"
              :options="wholeSlideOption"
              style="text-align: center; height: 100%; overflow: hidden;">
              <img class="p-1" v-for="(image, index) in wholeSlideImages" :src="image" :key="index" style="width: 90%;" />
            </viewer>
          </div> -->
          <div style="width: 100%; height: 800px" id="whole-slide-viewer" ref="image" />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Constant from '../../../../../Constant'
  import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon-canvas-overlay.js'
  import OpenSeadragon from 'OpenSeadragon'

  // const ipcRenderer = require('electron').ipcRenderer
  const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

  export default {
    name: 'whole-slide-image-page',
    data () {
      return {
        wholeSlideImages: [],
        viewer: null,
        selectedItem: null
        // wholeSlideOption: {
        //   inline: true,
        //   minZoomRatio: 0.1,
        //   maxZoomRatio: 4,
        //   button: false,
        //   toolbar: {
        //     play: 0,
        //     rotateLeft: 0,
        //     rotateRight: 0,
        //     flipHorizontal: 0,
        //     flipVertical: 0,
        //     oneToOne: 4,
        //     reset: 4,
        //     prev: 4,
        //     next: 4
        //   },
        //   viewed (e) {
        //     console.log('viewed')
        //     window.dispatchEvent(new Event('resize'))
        //   }
        // }
      }
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SELECT_BF_THUMBNAIL')
      this.EventBus.$off('SELECT_BF_ENCODE_IMG')
    },
    mounted () {
      var self = this

      // ipcRenderer.on(Constant.GET_BF_WHOLE_SLIDE_PATH, function (event, result) {
      //   console.log(result)
      //   result.forEach(function(item) {
      //     if (item.SEQ_NO === '0001') {
      //       self.wholeSlideImages.push('file:///' + item.PATH)
      //     }
      //   })
      // })

      // select bf image
      this.EventBus.$on('SELECT_BF_THUMBNAIL', function(params) {
        console.log(params)
        self.wholeSlideImages = []
        self.wholeSlideImages.push(params)
        self.viewerRedraw()
      })

      this.EventBus.$on('SELECT_BF_ENCODE_IMG', function(params) {
        self.wholeSlideImages = []
        self.wholeSlideImages.push(params)
      })

      // resize window
      this.EventBus.$on('SLIDE_STATE_CHANGE', function(state) {
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'))
        }, 10)
      })
    },
    methods: {
      initViewer () {
        var self = this
        var images = this.tileSourceFromData()

        var prefixUrl = 'node_modules/openseadragon/build/openseadragon/images/'
        if (env.NODE_ENV !== 'development') {
          var prefixUrl = env.LOCALAPPDATA + '/Programs/UIMD_PB_IA/resources/app.asar/node_modules/openseadragon/build/openseadragon/images/'
        }

        console.log(images)

        this.EventBus.$emit('OVERLAY', {state: true})

        this.viewer = OpenSeadragon({
          id: 'whole-slide-viewer',
          animationTime: 0.4,
          // prefixUrl: 'node_modules/openseadragon/build/openseadragon/images/',
          prefixUrl: prefixUrl,
          navigatorSizeRatio: 0.25,
          showNavigator: true,
          sequenceMode: true,
          showReferenceStrip: false,
          tileSources: images,
          // defaultZoomLevel: 0.1,
          gestureSettingsMouse: {clickToZoom: false}
        })

        this.viewer.addHandler('tile-loaded', function(event) {
          self.EventBus.$emit('OVERLAY', {state: false})
        })

      },
      tileSourceFromData () {
        var images = []

        this.wholeSlideImages.forEach(function(item) {
          images.push({ type: 'image', url: item, buildPyramid: false })
        })

        return images
      },
      viewerRedraw () {
        console.log('viewerRedraw')

        console.log(this.viewer)

        if (this.viewer !== null) {
          this.viewer.destroy()
          this.viewer = null
        }

        this.$nextTick(function () {
          this.initViewer()
        })
      }
    }
  }
</script>

<style>
  #wholeSlideImageCard {
    height: 886px;
  }
  #divWholeSlideViewer {
    height: 850px;
  }
</style>
