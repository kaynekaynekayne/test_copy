<template>
  <b-container id="wholeSlideThumbnail" fluid>
    <b-row>
      <b-col class="p-0 pt-1">
        <b-card id="wholeSlideCard" class="blackCard" text-variant="white" no-body>
          <!-- <b-row class="mt-2">
            <b-col>
              <span class="pointer reset" @click="onClickReset">Reset</span>
            </b-col>
          </b-row> -->
          <b-row class="mt-3">
            <b-row class="p-4">
              <b-col class="p-0" v-for="(image, index) in wholeSlideImages" cols="2" :key=index>
                <vue-load-image v-if="image.IS_HIGH_POWER_SCAN === 'Y'" @onLoad="onLoadImg">
                  <img slot="image" :id="image.SEQ_NO" :src="image.PATH" class="wholeSlideImg pointer" @click="onClickBfImg(image.SEQ_NO)"
                    style="border: 2px solid #00FF00; width: 100%;" />
                  <img slot="preloader" src="~@/assets/icon/loading-buffering.gif" style="padding: 15px; width: 70px;"/>
                </vue-load-image>
                <vue-load-image v-else @onLoad="onLoadImg">
                  <img slot="image" :id="image.SEQ_NO" :src="image.PATH" class="wholeSlideImg pointer" @click="onClickBfImg(image.SEQ_NO)"
                    style="width: 100%;" />
                  <img slot="preloader" src="~@/assets/icon/loading-buffering.gif" style="padding: 15px; width: 70px;"/>
                </vue-load-image>
              </b-col>
            </b-row>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import VueLoadImage from 'vue-load-image'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')

  export default {
    name: 'whole-slide-thumbnail-page',
    components: { 'vue-load-image': VueLoadImage },
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
        // orderId: Constant.GET_SELECT_ORDER_ID
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        ipcRenderer.send(Constant.GET_BF_WHOLE_SLIDE_PATH, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      }
    },
    // watch: {
    //   orderId: function(newVal, oldVal) {
    //     console.log('whole : ' + newVal)
    //     ipcRenderer.send(Constant.GET_BF_WHOLE_SLIDE_PATH, JSON.stringify({slotId: newVal}))
    //   }
    // },
    data () {
      return {
        wholeSlideImages: [],
        isCbcShow: true,
        selectedItem: null
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_BF_WHOLE_SLIDE_PATH)
    },
    mounted () {
      var self = this
      console.log('mounted whole slide thumbnail')

      this.isCbcShow = this.settings.isCbcShow

      ipcRenderer.on(Constant.GET_BF_WHOLE_SLIDE_PATH, function (event, result) {
        console.log(result)
        self.wholeSlideImages = result
        self.wholeSlideImages.sort(function (a, b) {
          return a.SEQ_NO - b.SEQ_NO
        })
      })

      this.EventBus.$on('SLIDE_STATE_CHANGE', function(state) {
        self.isCbcShow = state
      })

    },
    methods: {
      onLoadImg () {
        this.onClickBfImg('0001')
      },
      onClickBfImg (seqNo) {
        var self = this

        var selectImg = this.wholeSlideImages.filter(function(item) {
          return item.SEQ_NO === seqNo
        })

        var images = document.getElementsByClassName('wholeSlideImg')
        for (var i = 0; i < images.length; i++) {
          if (seqNo !== images[i].id) {
            images[i].classList.remove('wholeSlideSelect')
          } else {
            images[i].classList.add('wholeSlideSelect')

            if (selectImg[0].IS_HIGH_POWER_SCAN === 'N') {
              self.EventBus.$emit('SELECT_BF_THUMBNAIL', images[i].src)
            } else {
              var highPowerPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID + '/' + self.settings.bfHighDirName
              var highPowerImg = highPowerPath + '/' + seqNo + '.jpg'

              fs.stat(highPowerImg, (err) => {
                console.log(err)
                if (!err) {
                  self.EventBus.$emit('SELECT_BF_THUMBNAIL', 'file:///' + highPowerImg)
                } else {
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              })
            }
          }
        }
      },
      onClickReset (evt) {
        var self = this
        var images = document.getElementsByClassName('wholeSlideImg')

        for (var i = 0; i < images.length; i++) {
          images[i].classList.remove('wholeSlideSelect')
        }

        var logPowerPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID + '/' + self.settings.bfDirName + '/BF_EncoderImage.bmp'
        fs.stat(logPowerPath, (err) => {
          console.log(err)
          if (!err) {
            self.EventBus.$emit('SELECT_BF_ENCODE_IMG', 'file:///' + logPowerPath)
          } else {
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        })
      }
    }
  }
</script>

<style>
  #wholeSlideCard {
    height: 886px;
  }
  .reset {
    border: 1px solid;
    border-radius: 50px;
    padding: 5px;
    font-size: 12px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .reset:hover {
    background-color: #3F628C;
  }
</style>
