<template>
  <b-container id="rbcImageViewer" fluid>
    <b-row>
      <b-col class="pl-0 pr-0 pt-1">
        <b-card id="cardRowMagnification" class="blackCard" text-variant="white" no-body>
          <div id="rbcToolbar">
            <img id="popoverBrightness" class="pointer mt-1 ml-3" src="~@/assets/result/brightness.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverBrightness"
              placement="bottom"
              title="Brightness"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="brightnessValue"
                :min="80"
                :max="150"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>

            <!-- RGB -->
            <img id="popoverRGB" class="pointer mt-1 ml-3" src="~@/assets/result/rgb.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverRGB"
              placement="bottom"
              title="RGB"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="150"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="150"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="150"
                :process-style="{ backgroundColor: 'blue' }" />
              <b-button class="w-100 mt-2" variant="outline-primary" size="sm" @click="onRgbReset">Reset</b-button>
            </b-popover>
          </div>
          <b-tabs v-model="tabIndex" pills card lazy>
            <b-tab title="Low magnification" :title-link-class="linkClass(0)" active @click="onClickTab">
              <row-magnification-image :low-mag-viewer="lowMagViewer"></row-magnification-image>
            </b-tab>
            <b-tab title="Malaria" :title-link-class="linkClass(1)" @click="onClickTab">
              <malaria-image :signed-state="signedState" :order-id="orderId"></malaria-image>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import RowMagnificationImage from './RowMagnificationImage'
  import MalariaImage from './MalariaImage'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import Viewer from 'viewerjs'
  import ModalInfo from '../../../Common/ModalInfo'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'rbc-image-viewer',
    components: { RowMagnificationImage, MalariaImage, VueSlider },
    computed: {
      ...mapGetters({
        orderId: Constant.GET_SELECT_ORDER_ID,
        settings: Constant.GET_SETTINGS,
        rbcCheckList: Constant.GET_RBC_CLASS_LIST
      })
    },
    watch: {
      orderId: function(newVal, oldVal) {
        console.log(newVal, oldVal)
        var self = this

        self.removeRbcMarker()

        self.$nextTick(function() {
          console.log(self.lowMagViewer)
          if (self.tabIndex === 0) {
            self.lowMagViewer.update()
          } else {
            self.setImageStyle()
          }
        })
      },
      brightnessValue: function(newVal, oldVal) {
        var self = this

        console.log(self.tabIndex)
        if (self.tabIndex === 0) {
          if (self.lowMagViewer !== null) {
            self.lowMagViewer.image.style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        } else {
          var images = document.getElementById('malariaImage').querySelectorAll('img')

          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        }

        self.$store.dispatch(Constant.SET_RBC_BRIGHTNESS_SLIDE_VALUE, newVal)
      },
      redValue: function(newVal, oldVal) {
        var self = this

        if (self.tabIndex === 0) {
          if (self.lowMagViewer !== null) {
            self.lowMagViewer.image.style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        } else {
          var images = document.getElementById('malariaImage').querySelectorAll('img')

          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        }

        self.$store.dispatch(Constant.SET_RBC_RED_VALUE, newVal)
      },
      greenValue: function(newVal, oldVal) {
        var self = this

        if (self.tabIndex === 0) {
          if (self.lowMagViewer !== null) {
            self.lowMagViewer.image.style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        } else {
          var images = document.getElementById('malariaImage').querySelectorAll('img')

          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        }

        self.$store.dispatch(Constant.SET_RBC_GREEN_VALUE, newVal)
      },
      blueValue: function(newVal, oldVal) {
        var self = this

        if (self.tabIndex === 0) {
          if (self.lowMagViewer !== null) {
            self.lowMagViewer.image.style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        } else {
          var images = document.getElementById('malariaImage').querySelectorAll('img')

          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }
        }

        self.$store.dispatch(Constant.SET_RBC_BLUE_VALUE, newVal)
      }
    },
    data () {
      return {
        tabIndex: 0,
        signedState: '',
        lowMagViewer: null,
        rbcPosition: null,
        markerWidth: 2,
        markerHeight: 2,
        realRatio: 0,
        drawTimeId: null,
        brightnessValue: 100,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        lowMagnificationOptions: {
          inline: true,
          minZoomRatio: 0.1,
          maxZoomRatio: 4,
          tooltip: false,
          button: false,
          toggleOnDblclick: false,
          toolbar: {
            play: 0,
            rotateLeft: 0,
            rotateRight: 0,
            flipHorizontal: 0,
            flipVertical: 0,
            oneToOne: 4,
            reset: 4,
            prev: 4,
            next: 4
          }
          // viewed (e) {
          //   console.log('viewed')
          //   console.log(e)
          //
          //   var viewPercent = document.createElement('div')
          //   viewPercent.id = 'viewPercent'
          //   console.log(e.detail.image.width)
          //   console.log(e.detail.image.height)
          //
          //   // this.drawRbcMarker(e.detail.image.width, e.detail.image.height)
          //   document.getElementById('rowMagnificationImage').appendChild(viewPercent)
          // },
          // zoom (e) {
          //   console.log(e)
          //
          //   var ratio = (1000 / 280) * 100
          //   var curRatio = e.detail.ratio * 100
          //   var realRatio = (curRatio * (ratio / 100)).toFixed(0)
          //
          //   document.getElementById('viewPercent').innerHTML = realRatio + '%'
          //   document.getElementById('viewPercent').style.visibility = 'visible'
          //
          //   this.viewer.canvas.appendChild(document.getElementById('viewPercent'))
          // },
          // zoomed (e) {
          //   setTimeout(function() {
          //     document.getElementById('viewPercent').style.visibility = 'hidden'
          //   }, 500)
          // },
          // move (e) {
          //   console.log('move')
          //   console.log(e)
          // },
          // moved (e) {
          //   console.log('moved')
          //   console.log(e)
          // }
        }
      }
    },
    beforeDestroy () {
      this.EventBus.$off('VIEWER_ZOOM')
      this.EventBus.$off('SLIDE_STATE_CHANGE')

      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this

      this.initViewer()
      this.brightnessValue = this.settings.rbcBrightnessSlideValue
      this.redValue = this.settings.rbcRedValue
      this.greenValue = this.settings.rbcGreenValue
      this.blueValue = this.settings.rbcBlueValue

      console.log(this.brightnessValue)
      console.log(this.redValue)
      console.log(this.greenValue)
      console.log(this.blueValue)

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)

        self.signedState = result.SIGNED_STATE
        if (self.lowMagViewer !== null && self.tabIndex === 0) {
          self.removeRbcMarker()
          if (self.lowMagViewer.image !== null && typeof(self.lowMagViewer.image) !== 'undefined') {
            self.drawRbcMarker(self.lowMagViewer.image)
          }
          // self.lowMagViewer.destroy()
          // self.initViewer()
        }
      })

      this.EventBus.$on('SLIDE_STATE_CHANGE', function(state) {
        setTimeout(function () {
          self.removeRbcMarker()
          self.drawRbcMarker(self.lowMagViewer.image)
        }, 10)
      })

    },
    methods: {
      initViewer () {
        var self = this

        var evtPointerDown = function (e) {
          console.log('evtPointerDown')
          self.removeRbcMarker()
        }

        var evtPointerUp = function (e) {
          console.log('evtPointerUp')
          self.drawRbcMarker(self.lowMagViewer.image)
        }

        var evtReset = function (e) {
          console.log('evtReset')
          // self.EventBus.$emit('OVERLAY', {state: true})

          self.removeRbcMarker()
          setTimeout(function () {
            self.drawRbcMarker(self.lowMagViewer.image)
            // self.EventBus.$emit('OVERLAY', {state: false})
          }, 300)
        }

        var evtDblClick = function (e) {
          console.log(e)
          console.log(self.lowMagViewer.image)
          // var img = self.lowMagViewer.image
          // var imgWidth = Number(img.style.width.replace('px', ''))
          // var imgHeight = Number(img.style.height.replace('px', ''))
          // var marginLeft = Number(img.style.marginLeft.replace('px', ''))
          // var marginTop = Number(img.style.marginTop.replace('px', ''))
          //
          // console.log(imgWidth)
          // console.log(imgHeight)
          // console.log(marginLeft)
          // console.log(marginTop)
          //
          // var marker = new Image()
          // marker.src = require('@/assets/result/rbc_point.png')
          // marker.id = 'ccmarker'
          // marker.width = 50
          // marker.height = 50
          // marker.style.position = 'absolute'
          // marker.style.left = e.layerX + 'px'
          // marker.style.top = e.layerY + 'px'
          // marker.style.zIndex = '1'
          //
          // document.getElementById('rowMagnificationImage').appendChild(marker)
        }

        this.$nextTick(function() {
          console.log('mounted--------')
          self.lowMagViewer = new Viewer(document.getElementById('rowMagnificationImage'), self.lowMagnificationOptions)
          self.lowMagViewer.show()

          console.log(self.lowMagViewer)

          // console.log(self.lowMagViewer)
          self.lowMagViewer.options.viewed = function(e) {
            console.log('viewed')
            console.log(self.realRatio)

            var viewPercent = document.createElement('div')
            viewPercent.id = 'viewPercent'

            if (document.getElementById('viewPercent') === null) {
              document.getElementById('rowMagnificationImage').appendChild(viewPercent)
            }

            // 확대 비율 유지
            if (self.realRatio > 0) {
              var zoomRatio = ((self.realRatio * 0.28) / 100).toFixed(2)
              self.lowMagViewer.zoomTo(Number(zoomRatio))
            }

            this.viewer.canvas.removeEventListener('pointerdown', evtPointerDown, true)
            this.viewer.canvas.removeEventListener('pointerup', evtPointerUp, true)
            this.viewer.canvas.removeEventListener('dblclick', evtDblClick, true)
            document.getElementsByClassName('viewer-reset')[0].removeEventListener('click', evtReset, true)

            this.viewer.canvas.addEventListener('pointerdown', evtPointerDown, true)
            this.viewer.canvas.addEventListener('pointerup', evtPointerUp, true)
            this.viewer.canvas.addEventListener('dblclick', evtDblClick, true)
            document.getElementsByClassName('viewer-reset')[0].addEventListener('click', evtReset, true)

            console.log(document.getElementsByClassName('viewer-reset'))

            self.removeRbcMarker()
            self.drawRbcMarker(e.detail.image)
            //brightness, RGB
            self.setImageStyle()
          }

          self.lowMagViewer.options.zoom = function(e) {
            var ratio = (1000 / 280) * 100
            var curRatio = e.detail.ratio * 100
            self.realRatio = Number((curRatio * (ratio / 100)).toFixed(0))

            if (document.getElementById('viewPercent') !== null) {
              document.getElementById('viewPercent').innerHTML = self.realRatio + '%'
              document.getElementById('viewPercent').style.visibility = 'visible'

              this.viewer.canvas.appendChild(document.getElementById('viewPercent'))
            }

            self.removeRbcMarker()
          }

          self.lowMagViewer.options.zoomed = function(e) {
            console.log('zoomed')
            if (self.drawTimeId !== null) {
              clearTimeout(self.drawTimeId)
            }
            self.drawTimeId = setTimeout(function() {
              console.log(document.getElementById('viewPercent'))
              if (document.getElementById('viewPercent') !== null) {
                document.getElementById('viewPercent').style.visibility = 'hidden'
              }
              self.drawRbcMarker(self.lowMagViewer.image)
            }, 500)

          }

          self.lowMagViewer.options.moved = function(e) {
            console.log('moved')
            self.drawTimeId = setTimeout(function() {
              if (document.getElementById('viewPercent') !== null) {
                document.getElementById('viewPercent').style.visibility = 'hidden'
              }
            }, 500)
          }

          //
          // self.lowMagViewer.options.move = function(e) {
          //   console.log('move')
          //   self.removeRbcMarker()
          // }
        })
      },
      onClickTab (e) {
        var self = this
        this.$nextTick(function() {
          if (self.tabIndex === 0) {
            ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.orderId}))

            var viewPercent = document.createElement('div')
            viewPercent.id = 'viewPercent'

            if (document.getElementById('viewPercent') === null) {
              document.getElementById('rowMagnificationImage').appendChild(viewPercent)
            }

            self.drawRbcMarker(self.lowMagViewer.image)
          }

          self.setImageStyle()
        })
      },
      linkClass (idx) {
        if (this.tabIndex === idx) {
          return ['tabSelected']
        } else {
          return ['tabNonSelected']
        }
      },
      removeRbcMarker () {
        var markers = document.querySelectorAll('#rbcMarker')
        if (markers.length > 0) {
          markers.forEach(function(item, index) {
            document.getElementById('rowMagnificationImage').removeChild(item)
          })
        }
      },
      drawRbcMarker (img) {
        console.log(img)
        if (typeof(img) != 'undefined') {
          var self = this
          var imgWidth = Number(img.style.width.replace('px', ''))
          var imgHeight = Number(img.style.height.replace('px', ''))
          var marginLeft = Number(img.style.marginLeft.replace('px', ''))
          var marginTop = Number(img.style.marginTop.replace('px', ''))
          var containerRight = self.lowMagViewer.parentData.width - 20
          var containerBottom = self.lowMagViewer.parentData.height - 72

          // rbc position
          var rootPath = this.settings.pbiaRootPath + '/' + this.orderId
          var rbcPositionPath = rootPath + '/' + this.settings.rbcClassDirName + '/' + this.orderId + '.json'
          var positionInfo = []

          try {
            this.rbcPosition = JSON.parse(fs.readFileSync(rbcPositionPath, 'utf-8'))
            this.rbcPosition.forEach(function (jsonObj, index) {
              console.log(jsonObj)
              console.log(img.alt)

              if (img.alt === jsonObj.filename) {
                jsonObj.rbcClassList.forEach(function (category, categoryIndex) {
                  category.classInfo.sort(function(a, b) {
                    return a.classId - b.classId
                  })
                })

                jsonObj.rbcClassList.forEach(function (category, categoryIndex) {
                  if (category.categoryId === '01') {
                    category.classInfo.forEach(function (cls, index) {
                      self.settings.rbcSize.forEach(function(item, index) {
                        if (cls.classId === item) {
                          positionInfo.push(cls)
                        }
                      })
                    })
                  } else if (category.categoryId === '02') {
                    category.classInfo.forEach(function (cls, index) {
                      self.settings.rbcChromia.forEach(function(item, index) {
                        if (cls.classId === item) {
                          positionInfo.push(cls)
                        }
                      })
                    })
                  } else if (category.categoryId === '03') {
                    category.classInfo.forEach(function (cls, index) {
                      self.settings.rbcShape.forEach(function(item, index) {
                        if (cls.classId === item) {
                          positionInfo.push(cls)
                        }
                      })
                    })
                  } else if (category.categoryId === '04') {
                    category.classInfo.forEach(function (cls, index) {
                      self.settings.rbcPlatelet.forEach(function(item, index) {
                        if (cls.classId === item) {
                          positionInfo.push(cls)
                        }
                      })
                    })
                  } else if (category.categoryId === '05') {
                    category.classInfo.forEach(function (cls, index) {
                      self.settings.rbcInclusion.forEach(function(item, index) {
                        if (cls.classId === item) {
                          positionInfo.push(cls)
                        }
                      })
                    })
                  }
                })

                var wavg = (imgWidth / Number(jsonObj.orgWidth))
                var havg = (imgHeight / Number(jsonObj.orgHeight))

                if (self.realRatio < 100) {
                  self.markerWidth = 2
                  self.markerHeight = 2
                } else if (self.realRatio >= 100 && self.realRatio < 200) {
                  self.markerWidth = 3
                  self.markerHeight = 3
                } else if (self.realRatio >= 200 && self.realRatio < 500) {
                  self.markerWidth = 4
                  self.markerHeight = 4
                } else if (self.realRatio >= 500) {
                  self.markerWidth = 6
                  self.markerHeight = 6
                }

                positionInfo.forEach(function (item, classIndex) {
                  var xPos = ((marginLeft - 20) + (item.posX * wavg))
                  var yPos = ((marginTop - 20) + (item.posY * havg))

                  if (((xPos >= -20) && (yPos >= -20)) &&
                    ((containerRight >= xPos) && (containerBottom >= yPos))) {
                    var marker = new Image()
                    marker.src = require('@/assets/result/rbc_point.png')
                    marker.id = 'rbcMarker'
                    marker.width = self.markerWidth
                    marker.height = self.markerHeight
                    marker.style.position = 'absolute'
                    marker.style.left = xPos + 'px'
                    marker.style.top = yPos + 'px'
                    marker.style.zIndex = '1'

                    document.getElementById('rowMagnificationImage').appendChild(marker)
                  }
                })
              }
            })
          } catch (err) {
            this.$modal.show(ModalInfo, {code: err.code, message: err.message}, {
              height: 'auto',
              width: '550px'
            })
          }
        }

      },
      onRgbReset () {
        this.redValue = 0
        this.greenValue = 0
        this.blueValue = 0
      },
      setImageStyle () {
        if (this.tabIndex === 0) {
          this.lowMagViewer.image.style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
        } else {
          var images = document.getElementById('malariaImage').querySelectorAll('img')

          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          console.log(images)
        }
      }
    }
  }
</script>

<style>
  #cardRowMagnification {
    height: 887px;
  }
  #rbcToolbar {
    width: 120px;
    position: absolute;
    top: 14px;
    right: 10px;
  }
</style>
