<template>
  <div id="tilingViewer">
    <div style="width: 100%; height: 800px;" id="tiling-viewer" ref="image" />
    <div class="p-1 pointer" id="context-menu"
      style="position: absolute; display: none;">
      <b-form-select size="sm" v-model="cropSelect"
       @change="onCropRbc"
       :options="cropSelectData"></b-form-select>
      <!-- <span style="color: green;">Crop RBC</span> -->
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  // import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon/openseadragon.js'
  import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon-canvas-overlay.js'
  // import '../../../../components/Plugins/OpenSeadragonCanvasOverlayHd-master/dist/openseadragon-canvas-overlay-hd.min.js'
  // import '../../../../components/Plugins/openseadragon-filtering.js'
  import OpenSeadragon from 'OpenSeadragon'
  import contextMenu from 'vue-context-menu'

  const fs = require('fs')
  const path = require('path')
  const convert = require('xml-js')
  const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

  export default {
    name: 'tiling-viewer-page',
    components: { contextMenu },
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
      })
    },
    data () {
      return {
        viewer: null,
        canvasOverlay: null,
        filterExp: /^.dzi$/,
        malaImgfilterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        brightnessValue: 0,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        selectionMode: false,
        selectedItem: {},
        isGridShow: false,
        ruler: null,
        rulerPos: {
          prevPosX: 0,
          prevPosY: 0,
          posX: 0,
          posY: 0,
          left: 0,
          top: 0,
          width: 50,
          height: 50
        },
        rulerSize: 5,
        rulerWidth: 0,
        viewBoxWH: 150,
        isMagnifyingGlass: false,
        rectPath: null,
        drawPath: [],
        rbcCropBuf: null,
        cropItem: [],
        cropSelect: null,
        cropSelectData: [
          { value: null, text: '-'},
          {
            label: 'Shape',
            options: [
              { value: '03_01', text: 'Normal'},
              { value: '03_03', text: 'Target Cell'},
              { value: '03_04', text: 'Burr Cell'},
              { value: '03_05', text: 'Acanthocyte'},
              { value: '03_06', text: 'Ovalocyte'},
              { value: '03_07', text: 'Schistocyte'},
              { value: '03_08', text: 'Sickle Cell'},
              { value: '03_09', text: 'Stomatocyte'},
              { value: '03_10', text: 'Tear Drop Cell'},
              { value: '03_11', text: 'Spherocyte'}
            ]
          },
          {
            label: 'Platelet',
            options: [
              { value: '04_01', text: 'Platelet'}
            ]
          },
          {
            label: 'Inclusion Body',
            options: [
              { value: '05_01', text: 'Howell-Jolly Body'},
              { value: '05_02', text: 'Basophilic Stippling'},
              { value: '05_03', text: 'Malaria'}
            ]
          }
        ]
      }
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.viewerRedraw()
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SET_RED_VALUE')
      this.EventBus.$off('SET_GREEN_VALUE')
      this.EventBus.$off('SET_BLUE_VALUE')
      this.EventBus.$off('SET_RBC_BRIGHTNESS')
      this.EventBus.$off('UPDATE_LOWMAGNIFICATION')
      this.EventBus.$off('SET_CROP_MODE')
      this.EventBus.$off('UPDATE_RBC_MARKER')
      this.EventBus.$off('SET_TOGGLE_GRID')
      this.EventBus.$off('SET_RULER')
      this.EventBus.$off('SET_MAGNIFY')

      // this.viewer.removeAllHandlers('tile-loaded')
    },
    mounted () {
      var self = this

      console.log('mounted')

      this.$nextTick(function () {
        self.brightnessValue = self.settings.rbcBrightnessSlideValue
        self.redValue = self.settings.rbcRedValue
        self.greenValue = self.settings.rbcGreenValue
        self.blueValue = self.settings.rbcBlueValue

        // self.viewerRedraw()

        self.EventBus.$on('SET_RED_VALUE', function (value) {
          self.redValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_GREEN_VALUE', function (value) {
          self.greenValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_BLUE_VALUE', function (value) {
          self.blueValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_RBC_BRIGHTNESS', function(value) {
          self.brightnessValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('UPDATE_LOWMAGNIFICATION', function(value) {
          console.log(value)
          self.selectedItem = value
          self.viewerRedraw()
        })

        self.EventBus.$on('UPDATE_RBC_MARKER', function(value) {
          if (value) {
            self.clearCropElement()
            self.viewer.forceRedraw()
          }
        })

        self.EventBus.$on('SET_CROP_MODE', function(value) {
          self.selectionMode = value
          self.viewer.setMouseNavEnabled(!value)

          if (!self.selectionMode) {
            self.viewer.clearOverlays()
          }
        })

        // 2023_01_10_LBK : toggle grid
        self.EventBus.$on('SET_TOGGLE_GRID', function(value) {
          console.log(value)
          self.isGridShow = value
          self.viewer.forceRedraw()
        })

        // 2023_01_10_LBK : set ruler
        self.EventBus.$on('SET_RULER', function(value) {
          console.log(value)

          self.ruler = value
          self.viewer.forceRedraw()
          // if (self.viewer) {
          //   self.viewer.goToPage(self.viewer.currentPage())
          // }
        })

        self.EventBus.$on('SET_MAGNIFY', function(value) {
          self.isMagnifyingGlass = value
          console.log(self.isMagnifyingGlass)
        })

      })

    },
    methods: {
      clearCropElement () {
        var self = this

        self.cropSelect = null
        self.cropItem.forEach(function(cropItem, index) {
          self.viewer.removeOverlay(cropItem.cropElement)
          cropItem.rbcCropBuf = null
        })
        self.cropItem = []

        var contextMenu = document.getElementById('context-menu')
        contextMenu.style.display = 'none'

      },
      saveCropData (rbcPath, targetCategoryId, targetClassId, classNm) {
        var self = this

        console.log(self.cropItem)

        self.cropItem.forEach(function(cropItem, cropIndex) {
          var fileName = targetCategoryId + targetClassId + cropItem.x + cropItem.y + '.bmp'
          var srcFileName = cropItem.categoryId + cropItem.classId + cropItem.x + cropItem.y + '.bmp'

          var rbcPositionPath = self.settings.pbiaRootPath + '/' +
                                self.selectedItem.SLOT_ID + '/' +
                                self.settings.rbcClassDirName + '/' +
                                self.selectedItem.SLOT_ID + '.json'
          var tmpObj = {}
          self.rbcPosition = JSON.parse(fs.readFileSync(rbcPositionPath, 'utf-8'))
          self.rbcPosition.forEach(function (jsonObj, index) {
            jsonObj.rbcClassList.forEach(function(category) {
              if (cropItem.categoryId === category.categoryId) {
                category.classInfo.forEach(function(item, removeIndex) {
                  if (cropItem.classId === item.classId &&
                      cropItem.x + 20 === Number(item.posX) &&
                      cropItem.y + 20 === Number(item.posY)) {

                    // remove
                    category.classInfo.splice(removeIndex, 1)

                    // target temp
                    tmpObj.classId = targetClassId
                    tmpObj.classNm = classNm
                    tmpObj.posX = item.posX
                    tmpObj.posY = item.posY
                  }
                })
              }
            })
          })

          console.log(tmpObj)

          //append
          self.rbcPosition.forEach(function (jsonObj, index) {
            jsonObj.rbcClassList.forEach(function(category, classIndex) {
              if (targetCategoryId === category.categoryId) {
                console.log('push-----')
                category.classInfo.push(tmpObj)
              }
            })
          })

          var srcPath = self.settings.pbiaRootPath + '/' +
                        self.selectedItem.SLOT_ID + '/' +
                        self.settings.rbcClassDirName + '/' +
                        cropItem.categoryId + '_' + cropItem.classId + '_' + cropItem.classNm

          console.log('cropIndex : ' + cropIndex)
          console.log('rbcPath : ' + rbcPath + '/' + fileName)
          console.log('srcPath : ' + srcPath + '/' + srcFileName)

          // 파일 삭제
          fs.access(srcPath + '/' + srcFileName, fs.constants.F_OK, function(err) {
            if (!err) {
              fs.unlinkSync(srcPath + '/' + srcFileName)
            }
          })

          // write image
          fs.writeFileSync(rbcPath + '/' + fileName, cropItem.rbcCropBuf)

          // write json file
          fs.writeFileSync(rbcPositionPath, JSON.stringify(self.rbcPosition))

          if ((cropIndex + 1) === self.cropItem.length) {
            self.clearCropElement()
          }
        })
      },
      onCropRbc () {
        var self = this

        var targetCategoryId = self.cropSelect.substr(0, 2)
        var targetClassId = self.cropSelect.substr(3, 2)

        console.log(targetCategoryId)
        console.log(targetClassId)
        console.log(self.cropItem)

        if (self.cropSelect !== null) {
          // get class name
          var classNm = ''
          self.cropSelectData.forEach(function(item) {
            if (typeof(item.options) !== 'undefined') {
              item.options.forEach(function(option) {
                if (option.value === self.cropSelect) {
                  classNm = option.text
                }
              })
            }
          })

          var rbcPath = self.settings.pbiaRootPath + '/' +
                        self.selectedItem.SLOT_ID + '/' +
                        self.settings.rbcClassDirName + '/' +
                        self.cropSelect + '_' + classNm
          fs.access(rbcPath, function(err) {
            // 폴더 없으면 생성
            console.log(err)
            if (err) {
              fs.mkdir(rbcPath, {recursive: true}, function(err) {
                self.saveCropData(rbcPath, targetCategoryId, targetClassId, classNm)
              })
            } else {
              self.saveCropData(rbcPath, targetCategoryId, targetClassId, classNm)
            }
          })
        }
      },
      viewerRedraw () {
        console.log('viewerRedraw')
        console.log(fs)
        var self = this

        console.log(this.viewer)
        if (this.viewer !== null) {
          this.viewer.destroy()
          this.viewer = null
        }

        this.$nextTick(function () {
          self.EventBus.$emit('OVERLAY', {state: true})
          self.initViewer()
          self.selectionMode = false
        })
      },
      tileSourceFromData (path) {
        var xmlData = fs.readFileSync(path, 'utf-8')
        var json = JSON.parse(convert.xml2json(xmlData, {compact: true}))
        var url = path.split('.')[0] + '_files/'

        var dzi = {
          Image: {
            xmlns: json.Image._attributes.xmlns,
            Url: url,
            Format: json.Image._attributes.Format,
            Overlap: json.Image._attributes.Overlap,
            TileSize: json.Image._attributes.TileSize,
            Size: {
              Height: json.Image.Size._attributes.Height,
              Width: json.Image.Size._attributes.Width
            }
          }
        }

        return dzi
      },
      clearCanvas() {
        var self = this
        var ctx = self.canvasOverlay.context2d()
        ctx.clearRect(0, 0, self.canvasOverlay.imgWidth, self.canvasOverlay.imgHeight)
        ctx.beginPath()
      },
      drawGrid () {
        console.log('draw ddddddd')
        var self = this

        console.log(self.canvasOverlay)

        var ctx = self.canvasOverlay.context2d()
        ctx.strokeStyle = 'rgba(170, 170, 170, 0.5)'

        // Box width
        var bw = self.canvasOverlay.imgWidth
        // Box height
        var bh = self.canvasOverlay.imgHeight
        // Padding
        var p = 0

        for (var x = 0; x <= bw; x += 10) {
          ctx.moveTo(0.5 + x + p, p)
          ctx.lineTo(0.5 + x + p, bh + p)
        }

        for (var x = 0; x <= bh; x += 10) {
          ctx.moveTo(p, 0.5 + x + p)
          ctx.lineTo(bw + p, 0.5 + x + p)
        }

        ctx.stroke()
      },
      refreshRuler (element, rulerSize) {
        var self = this

        console.log(rulerSize)
        if(document.getElementById('rulerTitle') !== null) {
          element.removeChild(document.getElementById('rulerTitle'))
        }

        var rSize = 1
        if (rulerSize > 5) {
          rSize = rSize + (0.06 * (rulerSize - 5))
        }

        var zoomRatio = self.viewer.viewport.viewportToImageZoom(self.viewer.viewport.getZoom())
        console.log(zoomRatio)

        if (zoomRatio > 1) {
          zoomRatio = zoomRatio * 1.02
        } else if (zoomRatio > 0.9 && zoomRatio < 1) {
          zoomRatio = zoomRatio * 1.12
        } else if (zoomRatio > 0.7 && zoomRatio <= 0.9) {
          zoomRatio = zoomRatio * 1.22
        } else if (zoomRatio > 0.6 && zoomRatio <= 0.7) {
          zoomRatio = zoomRatio * 1.32
        } else if (zoomRatio > 0.5 && zoomRatio <= 0.6) {
          zoomRatio = zoomRatio * 1.42
        } else if (zoomRatio > 0.4 && zoomRatio <= 0.5) {
          zoomRatio = zoomRatio * 1.52
        } else if (zoomRatio > 0.3 && zoomRatio <= 0.4) {
          zoomRatio = zoomRatio * 1.72
        } else if (zoomRatio > 0.2 && zoomRatio <= 0.3) {
          zoomRatio = zoomRatio * 1.92
        }
        // self.rulerWidth = (zoomRatio * 0.6) * 100 * rSize

        console.log(self.canvasOverlay)
        console.log(self.viewer.viewport.getZoom())

        self.rulerWidth = 60 * (zoomRatio * rSize)
        console.log(self.rulerWidth)

        var titleElement = document.createElement('div')
        titleElement.id = 'rulerTitle'
        titleElement.style.color = 'black'
        titleElement.style.textAlign = 'center'
        titleElement.style.fontSize = '16px'
        titleElement.style.minWidth = '50px'
        titleElement.style.width = self.rulerWidth + 'px'

        if (self.ruler.id === 'line') {
          var startX = (self.viewBoxWH / 2) - (self.rulerWidth / 2)
          var endX = (self.viewBoxWH / 2) + (self.rulerWidth / 2)
          var startY = self.viewBoxWH / 2
          var endY = startY

          titleElement.innerHTML = '<div style="width: 100%;">' + self.rulerSize + 'μm' + '</div>' +
                                    '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
                                      '<line x1="' + startX + '" y1="' + startY + '" x2="' + endX + '" y2="' + endY + '" stroke="black" stroke-width="2"/>' +
                                      '<line x1="' + startX + '" y1="' + (startY-5) + '" x2="' + startX + '" y2="' + (endY+5) + '" stroke="black" stroke-width="2"/>' +
                                      '<line x1="' + endX + '" y1="' + (endY-5) + '" x2="' + endX + '" y2="' + (endY+5) + '" stroke="black" stroke-width="2"/>' +
                                    '</svg>'
          element.appendChild(titleElement)

        } else if (self.ruler.id === 'cross') {
          // horizontal
          var startX = (self.viewBoxWH / 2) - (self.rulerWidth / 2)
          var endX = (self.viewBoxWH / 2) + (self.rulerWidth / 2)
          var startY = self.viewBoxWH / 2
          var endY = startY

          // vertical
          var startX_V = startX + (self.rulerWidth / 2)
          var endX_V = startX_V
          var startY_V = (self.viewBoxWH / 2) - (self.rulerWidth / 2)
          var endY_V = (self.viewBoxWH / 2) + (self.rulerWidth / 2)

          console.log(startX)
          console.log(startY_V)
          titleElement.innerHTML = '<div style="width: 100%;">' + self.rulerSize + 'μm' + '</div>' +
                                   '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
                                     '<line x1="' + startX + '" y1="' + startY + '" x2="' + endX + '" y2="' + endY + '" stroke="black" stroke-width="2"/>' +
                                     '<line x1="' + startX + '" y1="' + (startY-5) + '" x2="' + startX + '" y2="' + (endY+5) + '" stroke="black" stroke-width="2"/>' +
                                     '<line x1="' + endX + '" y1="' + (endY-5) + '" x2="' + endX + '" y2="' + (endY+5) + '" stroke="black" stroke-width="2"/>' +
                                     '<line x1="' + startX_V + '" y1="' + startY_V + '" x2="' + endX_V + '" y2="' + endY_V + '" stroke="black" stroke-width="2"/>' +
                                     '<line x1="' + (startX_V-5) + '" y1="' + startY_V + '" x2="' + (startX_V+5) + '" y2="' + startY_V + '" stroke="black" stroke-width="2"/>' +
                                     '<line x1="' + (endX_V-5) + '" y1="' + endY_V + '" x2="' + (endX_V+5) + '" y2="' + endY_V + '" stroke="black" stroke-width="2"/>' +
                                   '</svg>'
          element.appendChild(titleElement)

        } else if (self.ruler.id === 'circle') {
          var cx = self.viewBoxWH / 2
          var cy = self.viewBoxWH / 2
          var radius = self.rulerWidth * 0.5

          titleElement.innerHTML = '<div style="width: 100%;">' + self.rulerSize + 'μm' + '</div>' +
                                   '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
                                    '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" stroke="black" stroke-width="2" fill="transparent" opacity="0.6" />' +
                                   '</svg>'
          element.appendChild(titleElement)
        }
      },
      drawRuler () {
        console.log('drawRuler')

        var self = this

        var divtilingViewer = document.getElementById('tilingViewer')

        if (divtilingViewer !== null) {
          var rulerOverlay = document.getElementById('rulerOverlay')
          if (rulerOverlay !== null) {
            // self.viewer.canvas.removeChild(rulerOverlay)
            divtilingViewer.removeChild(rulerOverlay)
          }

          // console.log(self.canvasOverlay._viewportWidth)

          var element = document.createElement('div')
          element.id = 'rulerOverlay'
          element.style.position = 'absolute'
          // element.style.background = 'rgba(0, 0, 0, 0.3)'
          element.style.width = self.rulerPos.width + 'px'
          element.style.height = self.rulerPos.height + 'px'

          if (self.rulerPos.left === 0) {
            element.style.left = (self.viewer.canvas.clientWidth / 2) - (self.rulerPos.width / 2) + 'px'
          } else {
            element.style.left = self.rulerPos.left + 'px'
          }

          if (self.rulerPos.top === 0) {
            element.style.top = (self.viewer.canvas.clientHeight / 2) - (self.rulerPos.height / 2) + 'px'
          } else {
            element.style.top = self.rulerPos.top + 'px'
          }

          self.refreshRuler(element, self.rulerSize)
          divtilingViewer.appendChild(element)

          var isPress = false

          element.onmousedown = function(e) {
            console.log('onmousedown')
            self.rulerPos.prevPosX = e.clientX
            self.rulerPos.prevPosY = e.clientY

            if (self.rulerPos.left <= 30) {
              self.rulerPos.left = 31
            }

            if (self.rulerPos.top <= 80) {
              self.rulerPos.top = 81
            }

            isPress = true
          }

          element.onmouseup = function() {
            console.log('onmouseup')

            isPress = false
          }

          element.onwheel = function(e) {
            console.log('onwheel')

            if (e.deltaY < 0) {
              if (self.rulerSize < 20) {
                self.refreshRuler(element, ++self.rulerSize)
              }

            } else {
              if (self.rulerSize > 5) {
                self.refreshRuler(element, --self.rulerSize)
              }
            }
          }

          var parent = document.getElementById('tilingViewer')

          parent.onmousemove = function(e) {
            console.log('onmousemove')
            console.log(e)
            if (!isPress) {
              return
            }

            if (self.rulerPos.left <= 30) {
              return
            }

            if (self.rulerPos.top <= 80) {
              return
            }

            console.log(self.rulerPos.left)
            console.log(self.rulerPos.top)

            self.rulerPos.posX = self.rulerPos.prevPosX - e.clientX
            self.rulerPos.posY = self.rulerPos.prevPosY - e.clientY

            self.rulerPos.prevPosX = e.clientX
            self.rulerPos.prevPosY = e.clientY

            element.style.left = (element.offsetLeft - self.rulerPos.posX) + 'px'
            element.style.top = (element.offsetTop - self.rulerPos.posY) + 'px'

            self.rulerPos.left = element.offsetLeft - self.rulerPos.posX
            self.rulerPos.top = element.offsetTop - self.rulerPos.posY
          }
        }
      },
      drawRbcMarker () {
        var self = this

        // rbc position
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        var rbcPositionPath = rootPath + '/' + this.settings.rbcClassDirName + '/' + this.selectedItem.SLOT_ID + '.json'
        var positionInfo = []

        var pathArray = this.viewer.tileSources[this.viewer.currentPage()].Image.Url.split('/')
        var fileUrl = pathArray[pathArray.length - 2]

        try {
          this.rbcPosition = JSON.parse(fs.readFileSync(rbcPositionPath, 'utf-8'))
          this.rbcPosition.forEach(function (jsonObj, index) {
            console.log(jsonObj)
            var imgFileName = jsonObj.filename.substring(0, jsonObj.filename.indexOf('.')) + '_files'

            if (fileUrl === imgFileName) {
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
                        cls.categoryId = category.categoryId
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '02') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcChromia.forEach(function(item, index) {
                      if (cls.classId === item) {
                        cls.categoryId = category.categoryId
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '03') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcShape.forEach(function(item, index) {
                      if (cls.classId === item) {
                        cls.categoryId = category.categoryId
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '04') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcPlatelet.forEach(function(item, index) {
                      if (cls.classId === item) {
                        cls.categoryId = category.categoryId
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '05') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcInclusion.forEach(function(item, index) {
                      if (cls.classId === item) {
                        cls.categoryId = category.categoryId
                        positionInfo.push(cls)
                      }
                    })
                  })
                }
              })

              // draw canvas overlay
              var ctx = self.canvasOverlay.context2d()
              ctx.lineWidth = '2'
              ctx.strokeStyle = 'red'

              self.rectPath = new Path2D()
              self.drawPath = []

              console.log(ctx)
              console.log(self.canvasOverlay)
              console.log(jsonObj)
              console.log(positionInfo)

              positionInfo.forEach(function (item, classIndex) {
                self.rectPath.rect(item.posX - 20, item.posY - 20, 40, 40)
                self.drawPath.push({
                  x: item.posX - 20,
                  y: item.posY - 20,
                  categoryId: item.categoryId,
                  classId: item.classId,
                  classNm: item.classNm,
                  fileName: jsonObj.filename
                })
              })
              ctx.stroke(self.rectPath)
            }
          })

        } catch (err) {
          console.log(err.message)
          // this.$modal.show(ModalInfo, {code: err.code, message: err.message}, {
          //   height: 'auto',
          //   width: '550px'
          // })
        }
      },
      initViewer () {
        console.log('tiling initViewer')
        var self = this

        console.log(this.selectedItem)
        try {
          var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
          var slotDirList = fs.readdirSync(rootPath)
          var magnificationPath = null

          console.log(rootPath)
          // low magnification
          for (var i = 0; i < slotDirList.length; i++) {
            if (slotDirList[i].includes(this.settings.rbcImageDirName)) {
              magnificationPath = rootPath + '/' + slotDirList[i]
            }
          }

          console.log(magnificationPath)
          var files = fs.readdirSync(magnificationPath).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase())
          })

          var tileSources = []

          files.forEach(function(dziFile) {
            tileSources.push(self.tileSourceFromData(magnificationPath + '/' + dziFile))
          })

          console.log(tileSources)
          // var exec = require('child_process').exec, child
          // child = exec('java -jar D:\\UIMD_Data\\UI_DB\\pyramidio-cli-1.1.0.jar -i D:/IA_Proc/20200526164300_2_AAAABBBBCCE/02_RBC_Image/RBC_Image.jpg -o file:///D:/IA_Proc/20200526164300_2_AAAABBBBCCE/02_RBC_Image',
          // function(error, stdout, stderr) {
          //   console.log('stdout: ' + stdout)
          //   console.log('stderr: ' + stderr)
          //   console.log(error)
          // })

          var prefixUrl = 'node_modules/openseadragon/build/openseadragon/images/'
          if (env.NODE_ENV !== 'development') {
            var prefixUrl = env.LOCALAPPDATA + '/Programs/UIMD_PB_IA/resources/app.asar/node_modules/openseadragon/build/openseadragon/images/'
          }

          self.viewer = OpenSeadragon({
            id: 'tiling-viewer',
            animationTime: 0.4,
            // prefixUrl: 'node_modules/openseadragon/build/openseadragon/images/',
            prefixUrl: prefixUrl,
            navigatorSizeRatio: 0.25,
            showNavigator: true,
            sequenceMode: true,
            showReferenceStrip: false,
            tileSources: tileSources,
            defaultZoomLevel: 1,
            gestureSettingsMouse: {clickToZoom: false}
          })

          var drag = null

          new OpenSeadragon.MouseTracker({
              element: self.viewer.element,
              pressHandler: function(event) {
                if (!self.selectionMode) {
                  return
                }

                var overlayElement = document.createElement('div')
                overlayElement.id = 'rectOverlay'
                overlayElement.style.background = 'rgba(0, 255, 0, 0.3)'
                var viewportPos = self.viewer.viewport.pointFromPixel(event.position)
                self.viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0))

                drag = {
                  overlayElement: overlayElement,
                  startPos: viewportPos
                }
              },
              dragHandler: function(event) {
                if (!drag) {
                  return
                }

                var viewportPos = self.viewer.viewport.pointFromPixel(event.position)
                var diffX = viewportPos.x - drag.startPos.x
                var diffY = viewportPos.y - drag.startPos.y

                var location = new OpenSeadragon.Rect(
                  Math.min(drag.startPos.x, drag.startPos.x + diffX),
                  Math.min(drag.startPos.y, drag.startPos.y + diffY),
                  Math.abs(diffX),
                  Math.abs(diffY)
                )

                console.log(drag)
                console.log(location)
                console.log(self.canvasOverlay)
                console.log(self.viewer)

                self.viewer.updateOverlay(drag.overlayElement, location)
                // var canvas = document.createElement('canvas')

              },
              moveHandler: function(event) {
                console.log('moveHandler')
                if (!self.isMagnifyingGlass) {
                  if (document.getElementById('magCanvas') !== null) {
                    self.viewer.element.removeChild(document.getElementById('magCanvas'))
                  }

                  return
                }

                const { canvas } = self.viewer.drawer
                const ctx = canvas.getContext("2d")

                console.log(event)
                console.log(event.position.x)
                console.log(event.position.y)
                console.log(canvas.width)

                if (document.getElementById('magCanvas') !== null) {
                  self.viewer.element.removeChild(document.getElementById('magCanvas'))
                }

                var magWidth = 200
                var magHeight = 200
                var zoomLevel = 5

                var magCanvas = document.createElement('canvas')
                magCanvas.id = 'magCanvas'
                magCanvas.style.position = 'absolute'
                magCanvas.style.left = (event.position.x - (magWidth / 2)) + 'px'
                magCanvas.style.top = (event.position.y - (magHeight / 2)) + 'px'
                magCanvas.style.border = '1px solid'
                magCanvas.style.borderRadius = '50%'
                magCanvas.style.width = magWidth + 'px'
                magCanvas.style.height = magHeight + 'px'
                magCanvas.style.zIndex = '20'

                self.viewer.element.appendChild(magCanvas)

                var magCtx = magCanvas.getContext('2d')

                magCtx.drawImage(canvas,
                  // (Math.min(Math.max(0, event.position.x - 5), canvas.width - 10)) - (magWidth / 2),
                  // (Math.min(Math.max(0, event.position.y - 5), canvas.height - 10)) - (magHeight / 2),
                  event.position.x - ((magWidth / 2) / 4),
                  event.position.y - ((magHeight / 2) / 4),
                  magWidth,
                  magHeight,
                  0,
                  0,
                  magWidth * zoomLevel,
                  (magHeight / 2) * zoomLevel
                )

                if (event.position.y <= 0 || event.position.x <= 0) {
                  magCanvas.style.visibility = 'hidden'
                } else {
                  magCanvas.style.visibility = 'visible'
                }

                console.log(self.viewer.element)

              },
              releaseHandler: function(event) {
                const { canvas } = self.viewer.drawer
                var source = canvas.toDataURL()

                console.log(drag)
                if (drag !== null) {
                  const img = new Image()
                  img.onload = function() {
                    var cropedCanvas = document.createElement('canvas')
                    var ctx = cropedCanvas.getContext('2d')
                    cropedCanvas.width = drag.overlayElement.clientWidth
                    cropedCanvas.height = drag.overlayElement.clientHeight

                    const pixelDens = OpenSeadragon.pixelDensityRatio
                    ctx.drawImage(img, drag.overlayElement.offsetLeft * pixelDens, drag.overlayElement.offsetTop * pixelDens, drag.overlayElement.offsetWidth * pixelDens, drag.overlayElement.offsetHeight * pixelDens, 0, 0, drag.overlayElement.offsetWidth, drag.overlayElement.offsetHeight)
                    var croppedSrc = cropedCanvas.toDataURL()
                    var croppedData = croppedSrc.replace(/^data:image\/\w+;base64,/, '')
                    var buf = Buffer.from(croppedData, 'base64')

                    var malariaPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID + '/' +
                                   self.settings.rbcClassDirName + '/' + self.settings.malariaDirName
                    var fileName = self.$getUuid() + '.bmp'

                    if (cropedCanvas.width > 0 && cropedCanvas.height > 0) {
                      self.EventBus.$emit('OVERLAY', {state: true})
                      fs.writeFile(malariaPath + '/' + fileName, buf, function(err) {
                        if (err !== null) {
                          self.$toasted.show(err.message, {
                            position: 'bottom-center',
                            duration: '2000'
                          })
                        } else {
                          drag = null
                          var malariaFiles = fs.readdirSync(malariaPath).filter(function (file) {
                            return self.malaImgfilterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                          })
                          self.EventBus.$emit('MALARIA_MOVE_COMPLETE', malariaFiles.length)
                        }

                        self.EventBus.$emit('OVERLAY', {state: false})
                      })
                    }
                  }

                  img.src = source
                }
              }
          })

          self.viewer.addHandler('tile-loaded', function(event) {
            self.EventBus.$emit('OVERLAY', {state: false})
            var canvas = document.createElement('canvas')
            canvas.width = event.image.width
            canvas.height = event.image.height

            // console.log(self.redValue)
            // console.log(self.greenValue)
            // console.log(self.blueValue)
            // console.log(self.brightnessValue)

            var renderedContext = canvas.getContext('2d')
            renderedContext.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + self.redValue + ',' + self.greenValue + ',' + self.blueValue + ')) brightness(' + self.brightnessValue + '%)'
            // renderedContext.globalAlpha = 0.2
            renderedContext.fillRect(0, 0, canvas.width, canvas.height)
            renderedContext.drawImage(event.image, 0, 0)

            event.tile.context2D = renderedContext

          })

          self.viewer.addHandler('canvas-click', function(event) {
            console.log(event)

            var width = self.viewer.viewport.getZoom() * 13
            var height = self.viewer.viewport.getZoom() * 13

            self.cropItem.forEach(function(cropItem, index) {
              self.viewer.removeOverlay(cropItem.cropElement)
            })

            if (!event.originalEvent.ctrlKey) {
              self.cropItem = []
              var contextMenu = document.getElementById('context-menu')
              contextMenu.style.display = 'none'
            }

            self.drawPath.forEach(function(item) {
              if (event.originalEvent.shiftKey) {
                self.cropItem.push(item)
              } else {
                var itemPos = self.viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(item.x,item.y))

                if ((event.position.x >= itemPos.x && event.position.x <= (itemPos.x + width)) &&
                    (event.position.y >= itemPos.y && event.position.y <= (itemPos.y + height))) {

                  // 기존 등록된 패스 제외
                  var isAdded = false
                  self.cropItem.forEach(function(cropItem) {
                    if (cropItem.x === item.x && cropItem.y === item.y) {
                      isAdded = true
                    }
                  })

                  if (!isAdded) {
                    self.cropItem.push(item)
                  }
                }
              }

            })

            self.cropItem.forEach(function(cropItem, index) {
              // overlay rect
              var beforeElement = document.getElementById('rectOverlay' + index)
              var itemRect = self.viewer.viewport.imageToViewportRectangle(new OpenSeadragon.Rect(cropItem.x, cropItem.y, 40, 40))
              var overlayElement = document.createElement('div')
              overlayElement.id = 'rectOverlay' + index
              overlayElement.style.background = 'rgba(0, 255, 0, 0.5)'
              cropItem.cropElement = overlayElement

              self.viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(itemRect.x, itemRect.y, itemRect.width, itemRect.height))

              // select box
              var contextMenu = document.getElementById('context-menu')
              contextMenu.style.display = 'block'
              contextMenu.style.left = (event.position.x + 50) + 'px'
              contextMenu.style.top = (event.position.y + 10) + 'px'

              if (self.cropItem.length === 1) {
                self.cropSelect = cropItem.categoryId + '_' + cropItem.classId
              } else {
                self.cropSelect = null
              }

              // crop image
              var rbcPath = self.settings.pbiaRootPath + '/' +
                            self.selectedItem.SLOT_ID + '/' +
                            self.settings.rbcImageDirName + '/' +
                            cropItem.fileName

              const img = new Image()
              img.src = rbcPath

              img.onload = function() {
                console.log('img.onload')

                var cropedCanvas = document.createElement('canvas')
                var cropedCtx = cropedCanvas.getContext('2d')
                cropedCanvas.width = 60 //overlayElement.clientWidth
                cropedCanvas.height = 60 //overlayElement.clientHeight

                // const pixelDens = OpenSeadragon.pixelDensityRatio
                // console.log(pixelDens)

                cropedCtx.drawImage(img,
                  cropItem.x - 10,
                  cropItem.y - 10,
                  60, 60,
                  0, 0,
                  60, 60)

                var croppedSrc = cropedCanvas.toDataURL()
                var croppedData = croppedSrc.replace(/^data:image\/\w+;base64,/, '')
                cropItem.rbcCropBuf = Buffer.from(croppedData, 'base64')

                console.log(self.cropItem)
              }

            })
          })

          self.canvasOverlay = self.viewer.canvasOverlay({
            onRedraw:function() {
              self.clearCanvas()
              self.drawRbcMarker()

              if (self.isGridShow) {
                self.drawGrid()
              }

              if (self.ruler !== null) {
                if (self.ruler.id === 'none') {
                  var rulerOverlay = document.getElementById('rulerOverlay')
                  if (rulerOverlay !== null) {
                    var divtilingViewer = document.getElementById('tilingViewer')
                    divtilingViewer.removeChild(rulerOverlay)
                  }
                } else {
                  self.drawRuler()
                }
              }
            },
            clearBeforeRedraw: true
          })

        } catch (err) {
          console.log(err.message)
        }
      }
    }
  }
</script>

<style>
  #tiling-viewer {
    position: relative;
  }
  #thumbnailCanvas {
    position: absolute;
    background-color: red;
    bottom: 0;
  }
  #rulerOverlay {
    cursor: move;
  }
</style>
