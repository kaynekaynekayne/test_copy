import api from '../../service'

const version = '/api/v1/'
const state = {
  pbData: {
    imageList: [],
    markerPosition: [],
    pbHotKeys: [],
    wbcImageList: [],
    selectedItem: {},
    customClass: null
  }
}

const mutations = {
  GET_PB_CLASSIFICATIONS (state, obj) {
    state.pbData.imageList = obj[0].data.results
    state.pbData.markerPosition = obj[1].data.results
    state.pbData.pbHotKeys = obj[2].data.results
  },
  SET_WBC_IMAGE_LIST (state, obj) {
    state.pbData.wbcImageList = obj
  },
  PB_UPDATE_WBC_IMAGE (state, obj) {
    console.log(obj)

    var params = obj.params
    var context = obj.context
    var results = obj.results
    var fileList = obj.fileList

    state.pbData.wbcImageList.forEach(function(wbcImage) {
      results.forEach(function(result) {
        if (wbcImage.id === result.CLASS_ID) {
          wbcImage.count = Number(result.COUNT)

          fileList.forEach(function(file) {
            var urlArray = file.currentSrc.split('/')
            var fileName = urlArray[urlArray.length - 1]

            // src
            if (file.srcClassId === wbcImage.id) {
              wbcImage.images.forEach(function(image, index) {
                var imgArray = image.split('/')
                var imageName = imgArray[imgArray.length - 1]
                var srcPath = context.rootState.CommonStore.settings.hostIp + version +
                              params.endPoint + '?path=' + params.path + '/' +
                              wbcImage.id + '_' + wbcImage.title + '/' + imageName

                if (fileName === imageName) {
                  console.log(srcPath)
                  wbcImage.images.splice(wbcImage.images.indexOf(srcPath), 1)
                }
              })
            }
            // dest
            if (file.targetClassId === wbcImage.id) {
              var destPath = context.rootState.CommonStore.settings.hostIp + version +
                             params.endPoint + '?path=' + params.path + '/' +
                             wbcImage.id + '_' + wbcImage.title + '/' + fileName
              console.log(destPath)
              wbcImage.images.splice(params.fileList[0].index, 0, destPath)
            }
          })
        }
      })
    })
  },
  SET_SELECTED_ITEM (state, obj) {
    state.pbData.selectedItem = obj
  },
  SET_CUSTOM_CLASS (state, obj) {
    state.pbData.customClass = obj
  }

}

const actions = {
  setWbcImageList: (context, obj) => {
    context.commit('SET_WBC_IMAGE_LIST', obj)
  },
  getPbClassifications: (context, obj) => {
    console.log(obj)
    console.log(context)

    obj.self.EventBus.$emit('OVERLAY', {state: true})
    Promise.all([
      api.PbIaGetFiles({
        path: context.rootState.CommonStore.settings.pbiaRootPath + '/' + obj.slotId,
        endPoint: 'images'
      }),
      api.PbIaGetMarkerPosition({
        path: context.rootState.CommonStore.settings.pbiaRootPath + '/' + obj.slotId + '/' +
              context.rootState.CommonStore.settings.wbcClassDirName,
        fileName: obj.slotId + '.json',
        endPoint: 'marker'
      }),
      api.PbIaGetHotKeys({
        endPoint: 'hotKey',
        type: '01'
      })
    ]).then(function(results) {
      console.log(results)

      context.commit('GET_PB_CLASSIFICATIONS', results)
      obj.self.EventBus.$emit('OVERLAY', {state: false})

    }).catch(function (err) {
      console.log(err.message)
      obj.self.$toasted.show(err.message, {
        position: 'bottom-center',
        duration: '2000'
      })
      obj.self.EventBus.$emit('OVERLAY', {state: false})
    })
  },
  updateClassification: (context, obj) => {
    api.PbIaUpdateClassCount({
      classList: obj.wbcImageList,
      cassetId: obj.cassetId,
      slotId: obj.slotId,
      endPoint: 'class/count'
    }).then(function(res) {
      console.log(res)

    }).catch(function(err) {
      self.$toasted.show(err.message, {
        position: 'bottom-center',
        duration: '2000'
      })
    })
  },
  PbIaMoveImage: (context, obj) => {
    console.log(obj)

    obj.self.EventBus.$emit('OVERLAY', {state: true})

    api.PbIaMoveImage(obj).then(function (res) {
      console.log(res)
      console.log(obj.wbcImageList)

      if (res.data.errorCode === 'E0000') {
        var results = res.data.results.retData
        var fileList = res.data.results.fileList

        context.commit('PB_UPDATE_WBC_IMAGE', {
          params: obj,
          context: context,
          results: results,
          fileList: fileList
        })

        obj.self.$initDrag()

      } else {
        obj.self.$toasted.show(res.data.errorMessage, {
          position: 'bottom-center',
          duration: '2000'
        })
      }

      obj.self.EventBus.$emit('OVERLAY', {state: false})

    }).catch(function(err) {
      obj.self.$toasted.show(err.message, {
        position: 'bottom-center',
        duration: '2000'
      })
      obj.self.EventBus.$emit('OVERLAY', {state: false})

    })
  },
  setSelectedItem: (context, obj) => {
    context.commit('SET_SELECTED_ITEM', obj)
  },
  iaSetCustomClass: (context, obj) => {
    obj.self.EventBus.$emit('OVERLAY', {state: true})

    api.PbIaGetCustomClass(obj).then(function (res) {
      if (res.data.errorCode === 'E0000') {
        context.commit('SET_CUSTOM_CLASS', res.data.results)
      } else {
        obj.self.$toasted.show(err.message, {
          position: 'bottom-center',
          duration: '2000'
        })
      }

      obj.self.EventBus.$emit('OVERLAY', {state: false})

    }).catch(function(err) {
      obj.self.$toasted.show(err.message, {
        position: 'bottom-center',
        duration: '2000'
      })
      obj.self.EventBus.$emit('OVERLAY', {state: false})

    })
  }
}

const getters = {
  getClassificationImages: state => {
    console.log('getClassificationImages')
    return state.pbData.imageList
  },
  getMarkerPosition: state => {
    return state.pbData.markerPosition
  },
  getPbHotKeys: state => {
    return state.pbData.pbHotKeys
  },
  getPbWbcImages: state => {
    return state.pbData.wbcImageList
  },
  getSelectedItem: state => {
    return state.pbData.selectedItem
  },
  iaGetCustomClass: state => {
    return state.pbData.customClass
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
