<template>
  <div class="container">
    <div class="modalTitle"></div>
    <div class="modalContent pb-3 pl-3 pr-3">

      <!-- remark -->
      <b-form-input size="sm" v-model="searchText" placeholder="search"></b-form-input>
      <b-card class="mt-2" style="height: 500px; overflow-y: scroll; overflow-x: hidden;">
        <b-row>
          <b-col cols="2" class="text-center colorWhite" style="background-color: #282828;"></b-col>
          <b-col cols="2" class="text-center colorWhite" style="background-color: #282828;">
            <strong>리마크 코드</strong>
          </b-col>
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>리마크 내용</strong>
          </b-col>
          <b-col cols="1" class="text-center colorWhite" style="background-color: #282828;"></b-col>
        </b-row>

        <div id="remarkWrapper">
          <div v-if="remarkList.length <= 0" class="text-center mt-3">No more data...</div>
          <b-row class="mt-2" v-for="remark in remarkList" :key="remark.REMARK_CD">
            <b-col cols="2">
              <b-form-checkbox
                v-model="remark.isSelected"
                value="Y"
                unchecked-value="N"
                @change="onSelectRemark(remark)">
              </b-form-checkbox>
            </b-col>
            <b-col cols="2" class="text-left">
              {{ remark.REMARK_CD }}
            </b-col>
            <b-col class="text-left">
              <b-form-textarea v-model="remark.REMARK_CONTENTS" rows="1" readonly
                style="background-color: white !important; border: 1px solid gray !important;
                  color: gray !important;">
              </b-form-textarea>
            </b-col>
            <b-col cols="1" class="pt-3">
              <b-icon class="pointer" icon="dash-circle" @click="onRemoveRemark(remark)"></b-icon>
            </b-col>
          </b-row>
        </div>
      </b-card>
      <b-row class="mt-2 pt-2 border-top" style="height: 200px; overflow-y: scroll; overflow-x: none;">
        <b-col cols="3">
          <b-form-input size="sm" v-model="remarkCd" placeholder="remark code"></b-form-input>
        </b-col>
        <b-col cols="6">
          <b-form-input v-for="(remark, index) in remarkContentsList"
            size="sm" v-model="remark.content"
            @input="onChangeInput(remark)"
            :key="keyIndex + index"></b-form-input>

          <!-- <b-form-textarea v-model="remarkContents" placeholder="remark contents" rows="2"
            @input="onInputRemark"
            style="background-color: white !important; border: 1px solid gray !important;
              color: gray !important;">
          </b-form-textarea> -->
        </b-col>
        <b-col class="pt-1">
          <b-icon class="pointer" icon="plus-circle" aria-hidden="true" @click="onClickPlus"></b-icon>
          <b-icon class="pointer" icon="x-circle" aria-hidden="true" @click="onClickMinus"></b-icon>
        </b-col>
        <b-col>
          <b-button class="custom-blue-btn" @click="onRemarkSave" size="sm">Save</b-button>
        </b-col>
      </b-row>

      <div class="text-right mt-3">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        <b-button class="custom-blue-btn" @click="onCancel" size="sm">CANCEL</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'
  import { mapGetters } from 'vuex'
  import ModalConfirm from './ModalConfirm'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-remark',
    props: [],
    computed: {
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_REMARK)
      this.EventBus.$off('REMOVE_SKMC_REMARK')
    },
    mounted () {
      var self = this

      ipcRenderer.send(Constant.GET_SKMC_REMARK, null)

      ipcRenderer.on(Constant.GET_SKMC_REMARK, function (event, results) {
        console.log(results)
        self.remarkOrgList = results
        self.remarkOrgList.forEach(function(item) {
          item.isSelected = 'N'
        })
        self.remarkList = self.remarkOrgList
      })

      this.EventBus.$on('REMOVE_SKMC_REMARK', function() {
        console.log('REMOVE_SKMC_REMARK')
        console.log(self.deleteRemark)

        if (self.deleteRemark !== null) {
          ipcRenderer.send(Constant.REMOVE_SKMC_REMARK, JSON.stringify({remarkCd: self.deleteRemark.REMARK_CD}))
          self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
          setTimeout(function() {
            ipcRenderer.send(Constant.GET_SKMC_REMARK, null)
          }, 300)
        }
      })
    },
    watch: {
      searchText: function(newVal, oldVal) {
        console.log(newVal, oldVal)
        var self = this
        this.remarkList = this.remarkOrgList.filter(function(item) {
          console.log(item.REMARK_CD.includes(newVal))
          console.log(item.REMARK_CONTENTS.includes(newVal))

          return (item.REMARK_CD.includes(newVal) || item.REMARK_CONTENTS.includes(newVal))
        })

        console.log(this.remarkList)
      }
    },
    data () {
      return {
        remarkCd: '',
        remarkContents: '',
        remarkContentsList: [{ content: ''}],
        remarkList: [],
        remarkOrgList: [],
        deleteRemark: null,
        searchText: '',
        keyIndex: 0,
        inputMaxByte: 80
      }
    },
    methods: {
      onChangeInput (remark) {
        console.log(remark)
        var result = this.$getLimitedByteText(remark.content, this.inputMaxByte)

        remark.content = result.validText
        if (result.totalByte >= 80) {
          this.keyIndex = (this.keyIndex + 1) * this.remarkContentsList.length
          this.$toasted.show('max row data', {
            position: 'bottom-center',
            duration: '2000'
          })
        }

      },
      onClickPlus () {
        var self = this
        var obj = {
          content: ''
        }

        if (self.remarkContentsList.length < 50) {
          self.remarkContentsList.push(obj)
        } else {
          self.$toasted.show('max 50 rows', {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onClickMinus () {
        var self = this

        if (self.remarkContentsList.length > 1) {
          self.remarkContentsList = self.remarkContentsList.slice(0, self.remarkContentsList.length - 1)
        }
      },
      onInputRemark () {
        console.log(this.remarkContents)

        // var maxRowSize = 75
        // var byte = 0
        //
        // for (var i = 0; i < this.remarkContents.length; i++) {
        //   if (this.remarkContents.charCodeAt(i) > 127) {
        //     byte += 3
        //   } else {
        //     byte++
        //   }
        // }
        //
        // console.log(byte)
        //
        // var newLineCount = this.remarkContents.match(/\n/g)
        // console.log(newLineCount)
        // if (newLineCount === null) {
        //   newLineCount = 0
        // } else {
        //   newLineCount = newLineCount.length
        // }
        // console.log(newLineCount)
        //
        // var isNewLine = Math.floor((byte - (newLineCount * maxRowSize)) / maxRowSize)
        // console.log(isNewLine)
        // if (isNewLine > 0) {
        //   this.remarkContents += '\n'
        // }
        //
        //
        // console.log(this.remarkContents)
      },
      onRemoveRemark (remark) {
        console.log('onRemoveRemark')
        console.log(remark)
        this.deleteRemark = remark

        this.$modal.show(ModalConfirm, {openType: 'removeSkmcRemark', message: 'Do you want to delete the ' + remark.REMARK_CD + '?'}, {
          height: 'auto',
          width: '350px'
        })

      },
      onRemarkSave () {
        console.log('onRemarkSave')
        console.log(this.remarkContentsList)

        var remarkContents = ''
        var self = this

        this.remarkContentsList.forEach(function(remark) {
          remarkContents += remark.content + '\n'
        })

        if (this.remarkCd === '') {
          this.$toasted.show('Please enter the Remark Code.', {
            position: 'bottom-center',
            duration: '2000'
          })
        } else if (remarkContents === '') {
          this.$toasted.show('Please enter the details of the remark.', {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          var params = {
            remarkCd: this.remarkCd,
            remarkContents: remarkContents,
            userId: this.currentUser.userId
          }

          ipcRenderer.send(Constant.SET_SKMC_REMARK, JSON.stringify(params))
          setTimeout(function() {
            self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
            ipcRenderer.send(Constant.GET_SKMC_REMARK, null)
          }, 300)
        }
      },
      onSelectRemark (remark) {
        console.log('onSelectRemark')
        console.log(remark)
        console.log(this.remarkList)

        // this.remarkList.forEach(function(item) {
        //   if (remark.REMARK_CD !== item.REMARK_CD) {
        //     item.isSelected = 'N'
        //   } else {
        //     item.isSelected = remark.isSelected
        //   }
        // })
      },
      onOk (evt) {
        var selectd = this.remarkList.filter(function(item) {
          return item.isSelected === 'Y'
        })

        this.EventBus.$emit('REMARK_SELECTED', selectd)
        this.$emit('close')
      },
      onCancel (evt) {
        this.$emit('close')
      },
      onClose (evt) {
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .modalTitle {
    padding: 10px;
  }
</style>
