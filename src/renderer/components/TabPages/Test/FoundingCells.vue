<template>
  <div id="foundingCells">
    <b-card class="blackCard h-100 pl-4 pr-4" text-variant="white" no-body>
      <b-row class="mt-2" style="height: 130px;">
        <b-col v-if="images.length > 0" class="pointer text-right" style="width: 50px;">
          <p class="h3 mt-5"><b-icon icon="caret-left" @click="onImgLeft"></b-icon></p>
        </b-col>
        <b-col cols="11">
          <carousel
            id="foundingImages"
            :perPageCustom="[[900, 10]]"
            :paginationEnabled="false"
            :paginationPadding="2"
            :paginationSize="10"
            paginationColor="gray"
            paginationActiveColor="#972000"
            ref="carousel">
            <slide class="text-center" v-for="(image, index) in images" :key="index">
              <img :src="'file://' + image.path" style="width: 120px;"/>
            </slide>
          </carousel>
        </b-col>
        <b-col v-if="images.length > 0" class="pointer" style="width: 50px;">
          <p class="h3 mt-5"><b-icon icon="caret-right" @click="onImgRight"></b-icon></p>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import fs from 'fs'

  export default {
    name: 'founding-cells',
    computed: {
      ...mapGetters({
        isPause: Constant.GET_PAUSE_STATE,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    watch: {
      images: function(newVal, oldVal) {
        if (newVal.length > 50) {
          this.images.splice(0, this.images.length - 50)
        } else {
          this.$refs.carousel.goToLastSlide()
        }
      },
      backendData: function(newVal, oldVal) {
        var self = this

        if (self.backendData.jobCmd === 'START') {
          self.images = []

        } else if (self.backendData.jobCmd === 'RUNNING_INFO') {
          if (!self.isPause) {
            var currentSlot = self.backendData.slotInfo.find(function (item) {
              return item.stateCd === '03'
            })

            if (typeof(currentSlot) !== 'undefined' && typeof(currentSlot.runningPath) !== 'undefined') {
              if (currentSlot.runningPath.length > 0) {
                var runningPath = JSON.parse(JSON.stringify(currentSlot.runningPath))
                for (var i = 0; i < runningPath.length; i++) {
                  runningPath[i].path = runningPath[i].path + '?' + self.$getDateTimeStr()
                  self.images.push(runningPath[i])
                }
              }
            }
          }
        }
      }
    },
    data () {
      return {
        slide: 0,
        sliding: null,
        scrollXPos: 0,
        scrollXPosNext: 0,
        scrollStep: 20,
        images: []
      }
    },
    beforeDestroy () {
      // this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
    },
    mounted () {
      var self = this

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //   if (jobCmd === 'START') {
      //     self.images = []
      //
      //   } else if (jobCmd === 'RUNNING_INFO') {
      //     if (!self.isPause) {
      //       var currentSlot = params.slotInfo.find(function (item) {
      //         return item.stateCd === '03'
      //       })
      //
      //       if (typeof(currentSlot) !== 'undefined' && typeof(currentSlot.runningPath) !== 'undefined') {
      //         if (currentSlot.runningPath.length > 0) {
      //           var runningPath = JSON.parse(JSON.stringify(currentSlot.runningPath))
      //           for (var i = 0; i < runningPath.length; i++) {
      //             runningPath[i].path = runningPath[i].path + '?' + self.$getDateTimeStr()
      //             self.images.push(runningPath[i])
      //           }
      //         }
      //       }
      //     }
      //   }
      // })

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.images = []
      })
    },
    methods: {
      onImgLeft (evt) {
        if (this.$refs.carousel.canAdvanceBackward) {
          this.$refs.carousel.goToPage(this.$refs.carousel.currentPage - 1)
        }
      },
      onImgRight (evt) {
        if (this.$refs.carousel.canAdvanceForward) {
          this.$refs.carousel.goToPage(this.$refs.carousel.currentPage + 1)
        }
      }
    }
  }
</script>
<style>
  #foundingCells {
    height: 117px;
  }
</style>
