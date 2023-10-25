<template>
  <div class="container">
    <div class="modalTitle">
      Regist
    </div>
    <div class="modalContent pb-3 pl-3 pr-3">

      <div>
        <b-form-input size="sm" v-model="resultCd" placeholder="result code"></b-form-input>
      </div>

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

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-add-result-cd',
    props: ['codes'],
    computed: {
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    beforeDestroy () {
      ipcRenderer.send(Constant.GET_SKMC_RESULT_CD, null)
    },
    mounted () {
      console.log(this.codes)
    },
    data: function () {
      return {
        resultCd: ''
      }
    },
    methods: {
      onOk (evt) {
        console.log('onOk')
        if (this.resultCd === null || this.resultCd === '') {
          this.$toasted.show(Constant.IDS_MSG_FAILED, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          var code = this.$getUuid()
          console.log(code)

          ipcRenderer.send(Constant.SET_SKMC_RESULT_CD, JSON.stringify({resultCd: code, resultCdNm: this.resultCd, userId: this.currentUser.userId}))
          this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
          this.$emit('close')
        }
      },
      onCancel (evt) {
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
