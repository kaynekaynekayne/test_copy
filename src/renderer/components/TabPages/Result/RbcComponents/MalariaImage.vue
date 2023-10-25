<template>
  <div id="malariaImage">
    <div v-drag-target id="43_InclusionBody_Malaria"
      class="data-draggable-target"
      data-draggable="target"
      @wheel.ctrl="zoom"
      style="text-align: left; overflow: auto; height: 500px;">
        <img class="data-draggable-item pointer"
          data-draggable="item"
          v-for="malaria, index in malariaList"
          :src="malaria"
          :id="'MA_' + index"
          :key="index"
          style="width: 120px;">
    </div>
    <div class="border-bottom">No Malaria</div>
    <div
      v-drag-target
      class="data-draggable-target pointer"
      id="44_InclusionBody_NoMalaria"
      data-draggable="target"
      @wheel.ctrl="zoom"
      style="text-align: left; overflow: auto; height: 250px;">
      <img class="data-draggable-item"
        data-draggable="item"
        v-for="noMalaria, index in noMalariaList"
        :src="noMalaria"
        :id="'NOMA_' + index"
        :key="index"
        style="width: 120px;">
    </div>
  </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  import api from '@/service'

  export default {
    name: 'malaria-image',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE
      })
    },
    data () {
      return {
        malariaList: [],
        noMalariaList: [],
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        moveCnt: 0,
        malariaList: [],
        noMalariaList: [],
        selectedItem: null,
        moveCnt: 0,
        signedState: ''
      }
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj

        this.initElement()
      }
    },
    beforeDestroy () {
      this.$off('APPEND_CHILD')
      this.EventBus.$off('UPDATE_MALARIA')
    },
    mounted () {
      var self = this

      // document.getElementById(this.settings.malariaDirNm).style.height = '615px'
      // document.getElementById(this.settings.noMalariaDirNm).style.height = '160px'

      // this.selectedItem = JSON.parse(this.$route.params.selectedItem)

      // this.initElement()
      // this.setImageStyle()

      this.EventBus.$on('UPDATE_MALARIA', function(params) {
        console.log(params)
        self.selectedItem = params
        self.initElement()
      })

      this.$on('APPEND_CHILD', function(fileParams) {
        console.log('APPEND_CHILD')

        var maxSize = fileParams.data.maxSize
        var url = fileParams.data.image.currentSrc.split('/')
        var fileName = url[url.length - 1]
        var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
        var srcPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + fileParams.data.srcId + '/' + fileName
        var destPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + fileParams.data.targetId + '/' + fileName

        // 파일 폴더 이동
        var params = {
          srcPath: srcPath,
          destPath: destPath
        }

        api.moveFile(params).then(function (res) {
          console.log(res)
          self.moveCnt++

          if (fileParams.data.srcId === self.settings.malariaDirName) {
            // delete malaria image
            self.malariaList.forEach(function(malaria, index) {
              if (malaria === 'file://' + srcPath) {
                self.malariaList.splice(index, 1)
              }
            })

            // push no malaria image
            self.noMalariaList.push('file://' + destPath)

          } else {
            // delete no malaria image
            self.noMalariaList.forEach(function(noMalaria, index) {
              if (noMalaria === 'file://' + srcPath) {
                self.noMalariaList.splice(index, 1)
              }
            })

            // push malaria image
            self.malariaList.push('file://' + destPath)
          }

          // complete move files
          if (self.moveCnt === maxSize) {
            self.$nextTick(function () {
              setTimeout(function() {
                self.EventBus.$emit('MALARIA_MOVE_COMPLETE', self.malariaList.length)
                self.moveCnt = 0

                // drag 활성화
                self.$initDrag()
              })
            })
          }
        }).catch(function (err) {
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })

        })


        // self.moveFile(params, targetFileName, 'APPEND_CHAILD').then(function(ret) {
        //   self.moveCnt++
        //
        //   if (self.moveCnt === params.data.maxSize) {
        //     self.$nextTick(function () {
        //       // draw cell marker
        //       setTimeout(function() {
        //          console.log('move complete')
        //
        //          self.EventBus.$emit('MALARIA_MOVE_COMPLETE', self.malariaList.length)
        //          self.moveCnt = 0
        //        }, 0)
        //      })
        //    }
        //  })
       })
    },
    methods: {
      getSlideInfo () {
        console.log('getSlideInfo')
        // var self = this
        //
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.orderId}))
        //
        // ipcRenderer.once(Constant.GET_TEST_HISTORY, function (event, result) {
        //   console.log(result)
        //
        //   self.signedState = result.SIGNED_STATE
        //   self.initElement()
        // })
      },
      setImageStyle () {
        this.signedState = this.selectedItem.SIGNED_STATE

        if (this.selectedItem.SIGNED_STATE === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
          document.getElementById(this.settings.malariaDirName).removeAttribute('class')
          document.getElementById(this.settings.malariaDirName).removeAttribute('aria-dropeffect')

          document.getElementById(this.settings.noMalariaDirName).removeAttribute('class')
          document.getElementById(this.settings.noMalariaDirName).removeAttribute('aria-dropeffect')

          var maChild = document.getElementById(this.settings.malariaDirName).childNodes
          var noChild = document.getElementById(this.settings.noMalariaDirName).childNodes

          for (var i = 0; i < maChild.length; i++) {
            maChild[i].removeAttribute('class')
            maChild[i].removeAttribute('draggable')
            maChild[i].removeAttribute('tabindex')
          }

          for (var i = 0; i < noChild.length; i++) {
            noChild[i].removeAttribute('class')
            noChild[i].removeAttribute('draggable')
            noChild[i].removeAttribute('tabindex')
          }
        }
      },
      initElement () {
        try {
          var self = this
          var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID

          fs.readdir(rootPath, function(err, files) {
            if (!err) {
              var rootPathMalaria = null
              var rootPathNoMalaria = null
              var malariaFiles = null
              var noMalariaFiles = null

              files.forEach(function(file) {
                if (file.includes(self.settings.rbcClassDirName)) {
                  rootPathMalaria = rootPath + '/' + file + '/' + self.settings.malariaDirName
                  rootPathNoMalaria = rootPath + '/' + file + '/' + self.settings.noMalariaDirName

                  // load malaria
                  fs.readdir(rootPathMalaria, function(err, malariaDirFiles) {
                    if (!err) {
                      malariaFiles = malariaDirFiles.filter(function(file) {
                        return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                      })

                      self.malariaList = []
                      for (var i = 0; i < malariaFiles.length; i++) {
                        self.malariaList.push('file://' + rootPathMalaria + '/' + malariaFiles[i])
                      }

                      self.$initDrag()
                    } else {
                      self.$toasted.show(err.message, {
                        position: 'bottom-center',
                        duration: '2000'
                      })
                    }
                  })

                  // load no malaria
                  fs.readdir(rootPathNoMalaria, function(err, noMalariaDirFiles) {
                    if (!err) {
                      noMalariaFiles = noMalariaDirFiles.filter(function(file) {
                        return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                      })

                      self.noMalariaList = []
                      for (var i = 0; i < noMalariaFiles.length; i++) {
                        self.noMalariaList.push('file://' + rootPathNoMalaria + '/' + noMalariaFiles[i])
                      }

                      self.$initDrag()
                    } else {
                      self.$toasted.show(err.message, {
                        position: 'bottom-center',
                        duration: '2000'
                      })
                    }
                  })
                }
              })
            } else {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
        } catch (err) {
          self.$modal.show(ModalInfo, {item: err.message}, {
            height: 'auto',
            width: '550px'
          })
        }
      },
      zoom (evt) {
        var targetElement = null
        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        if (evt.deltaY < 0) {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth + 1) + 'px'
          if ((images[0].offsetWidth + 1) < 192) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth - 1) + 'px'
          if ((images[0].offsetWidth - 1) > 65) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }
      }
      // moveFile (params, targetFileName, evt) {
      //   return new Promise((succ, fail) => {
      //     var self = this
      //     var url = params.data.image.currentSrc.split('/')
      //     var srcFileName = url[url.length - 1]
      //     var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
      //     var slotDirList = fs.readdirSync(rootPath)
      //     var targetPath = null
      //
      //     for (var i = 0; i < slotDirList.length; i++) {
      //       if (slotDirList[i].includes('RBC_Classification')) {
      //         targetPath = rootPath + '/' + slotDirList[i] + '/' + params.data.targetId
      //       }
      //     }
      //
      //     fs.access(targetPath + '/' + targetFileName, fs.F_OK, (err) => {
      //       if (err) {
      //         if (err.code === 'ENOENT') {
      //           var srcPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + params.data.srcId + '/' + srcFileName
      //           var destPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + params.data.targetId + '/' + targetFileName
      //
      //           // 현재 탭으로 이동 제외
      //           if (params.data.srcId === params.data.targetId) {
      //             fail('current tab')
      //           }
      //
      //           fs.stat(targetPath, (err) => {
      //             if (!err) {
      //               fs.rename(srcPath, destPath, (err) => {
      //                 if (err) {
      //                   throw err
      //                 }
      //
      //                 if (params.data.srcId === self.settings.malariaDirName) {
      //                   for (var i = 0; i < self.malariaList.length; i++) {
      //                     // 이미지 삭제
      //                     if (self.malariaList[i] === 'file://' + srcPath) {
      //                       self.malariaList.splice(i, 1)
      //                     }
      //                   }
      //
      //                   self.noMalariaList.push('file://' + destPath)
      //
      //                 } else {
      //                   for (var i = 0; i < self.noMalariaList.length; i++) {
      //                     // 이미지 삭제
      //                     if (self.noMalariaList[i] === 'file://' + srcPath) {
      //                       self.noMalariaList.splice(i, 1)
      //                     }
      //                   }
      //
      //                   self.malariaList.push('file://' + destPath)
      //
      //                 }
      //
      //                 // drag 활성화
      //                 self.$initDrag()
      //                 succ('success')
      //               })
      //             }
      //           })
      //         }
      //       } else {
      //         fail(err)
      //       }
      //     })
      //   })
      // }
    }
  }
</script>

<style>
</style>
