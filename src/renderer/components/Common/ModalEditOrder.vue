<template>
  <div class="container">
    <div class="modalTitle">
      <span>Edit result data</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          PB/BF
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.type" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Tray Slot
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.traySlot" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          BARCODE ID
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="barcodeNo" v-model="modelData.barcodeNo" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          PATIENT ID
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="patientId" v-model="modelData.patientId" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          PATIENT NAME
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="patientNm" v-model="modelData.patientNm" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Analyzed date
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="analyzedDate" type="text" v-model="modelData.analyzedDate" disabled></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Signed state
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="signedState" type="text" v-model="modelData.signedState" disabled></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Barcode Image
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <img :src="modelData.barcodePath" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2">
        <b-col class="text-right">
          <b-button id="btnOrderEntry" class="custom-blue-btn" @click="onOk" size="sm">Ok</b-button>
          <b-button id="btnOrderEntry" class="custom-blue-btn" @click="onClose" size="sm">Cancel</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'
  const fs = require('fs')
  const path = require('path')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-edit-order',
    props: [
      'item'
    ],
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    data: function () {
      return {
        modelData: {
          type: '',
          traySlot: '',
          barcodeNo: '',
          patientId: '',
          patientNm: '',
          analyzedDate: '',
          signedState: '',
          barcodePath: ''
        },
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      }
    },
    mounted () {
      var self = this

      console.log(this.item)
      this.modelData.type = this.item.TEST_TYPE

      try {
        var rootPath = this.settings.pbiaRootPath + '/' + this.item.SLOT_ID + '/00_Barcode_Image'
        this.modelData.barcodePath = 'file://' + rootPath + '/' + fs.readdirSync(rootPath)[0]
        // var files = fs.readdirSync(rootPath).filter(function (file) {
        //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
        // })
      } catch (err) {
        console.log(err)
      }

      console.log(this.item)
      this.modelData.traySlot = '1-' + this.item.SLOT_NO
      this.modelData.barcodeNo = this.item.BARCODE_NO
      this.modelData.patientId = this.item.PATIENT_ID
      this.modelData.patientNm = this.item.PATIENT_NM
      this.modelData.analyzedDate = this.item.ANALYZE_DTTM
      this.modelData.signedState = this.item.SIGNED_STATE

    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onOk (evt) {
        var obj = {
          slotId: this.item.SLOT_ID,
          barcodeNo: this.modelData.barcodeNo,
          patientId: this.modelData.patientId,
          patientNm: this.modelData.patientNm,
          cassetId: this.item.CASSET_ID,
          userId: this.currentUser.userId
        }

        ipcRenderer.send(Constant.UPDATE_TEST_HISTORY, JSON.stringify(obj))
        // this.$store.dispatch({ type: Constant.UPDATE_TEST_HISTORY, obj: obj })

        this.EventBus.$emit('EDIT_OK')
        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>
