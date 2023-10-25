<template>
  <div class="container">
    <div class="modalTitle">
      <span>PB-IA</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div>
        {{ modalContent }}
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
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-conform',
    props: [
      'item',
      'openType',
      'message'
    ],
    beforeDestroy () {
    },
    mounted () {
      this.modalContent = this.message
    },
    data: function () {
      return {
        modalContent: ''
      }
    },
    methods: {
      onOk (evt) {
        if (this.openType === 'immersionOil') {
          this.$store.dispatch(Constant.INIT_OIL_COUNT)
        } else if (this.openType === 'powerOff') {
          ipcRenderer.send('SHUTDOWN', {})
          worker.norWorker.terminate()
          worker.sysWorker.terminate()
        } else if (this.openType === 'deleteAccount') {
          // this.$store.dispatch(Constant.DELETE_USER, this.item.userId)
          this.EventBus.$emit(Constant.DELETE_USER, this.item.userId)
        } else if (this.openType === 'deleteTestHistory') {
          this.EventBus.$emit(Constant.DELETE_TEST_HISTORY)
        } else if (this.openType === 'logout') {
          this.$router.push('/loginPage')
        } else if (this.openType === 'userStop') {
          this.EventBus.$emit('RECOVER_GRIPPER')
        } else if (this.openType === 'lisUpload') {
          this.EventBus.$emit('UPLOAD_LIS')
        } else if (this.openType === 'dataBackup') {
          this.EventBus.$emit('BACKUP_DATA')
        } else if (this.openType === 'dataRestore') {
          this.EventBus.$emit('RESTORE_DATA')
        } else if (this.openType === 'removeSkmcResultCd') {
          this.EventBus.$emit('REMOVE_SKMC_RESULT_CD')
        } else if (this.openType === 'removeSkmcRemark') {
          this.EventBus.$emit('REMOVE_SKMC_REMARK')
        } else if (this.openType === 'lisUploadSkmc') {
          this.EventBus.$emit('UPLOAD_LIS_SKMC')
        } else if (this.openType === 'reportSign') {
          this.EventBus.$emit('REPORT_SIGN')
        }

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
