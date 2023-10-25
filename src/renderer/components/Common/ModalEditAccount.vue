<template>
  <div class="container">
    <div class="modalTitle">
      <span>Edit Account</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <b-row class="pb-2 border-bottom">
        <b-col cols="4">
          User Type
        </b-col>
        <b-col>
          <b-form-select v-model="modelData.authCd" :options="userTypeList" size="sm"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          User ID
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.userId" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          Name
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.userName"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          Employee
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.empNo"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          State
        </b-col>
        <b-col>
          <b-form-select v-model="modelData.isAvailable" :options="stateList" size="sm"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          Subscription Date
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.createDttm" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="4" class="pt-1">
          Latest Date
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.loginDttm" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2">
        <b-col class="text-right">
          <b-button id="btnOrderEntry" class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-edit-account',
    props: [
      'item'
    ],
    computed: {
      ...mapGetters({
        commonCode: Constant.GET_COMMON_CODE
      }),
    },
    data: function () {
      return {
        modelData: {},
        stateList: [{ value: 'Y', text: 'Y' }, { value: 'N', text: 'N' }],
        userTypeList: [{ value: '01', text: 'normal' }, { value: '02', text: 'admin' }]
      }
    },
    mounted () {
      this.modelData = JSON.parse(JSON.stringify(this.item))
      this.modelData.createDttm = this.$stringToDateTime(this.modelData.createDttm)
      this.modelData.loginDttm = this.$stringToDateTime(this.modelData.loginDttm)

      console.log(this.modelData)
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onOk (evt) {
        this.modelData.authNm = this.commonCode(Constant.GET_CODE_LIST_USER_AUTHORIZATION, this.modelData.authCd).cdNm

        if (this.modelData.isAvailable === 'true') {
          this.modelData.isAvailable = true
        } else if (this.modelData.isAvailable === 'false') {
          this.modelData.isAvailable = false
        }

        console.log(this.modelData)
        ipcRenderer.send(Constant.UPDATE_USER, JSON.stringify(this.modelData))
        this.$store.dispatch(Constant.UPDATE_USER, this.modelData)

        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>
