<template>
  <div class="container">
    <div class="modalTitle">
      Modify remark
    </div>
    <div class="modalContent pb-3 pl-3 pr-3">
      <div>
        <b-form-textarea size="sm" v-model="remarkContent"
          placeholder="remark" rows="10"></b-form-textarea>
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
  import { mapGetters } from 'vuex'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-modify-remark',
    props: ['remark'],
    computed: {
      ...mapGetters({
      })
    },
    beforeDestroy () {
    },
    mounted () {
      if (typeof(this.remark) !== 'undefined') {
        this.remarkCd = this.remark.REMARK_CD
        this.remarkContent = this.remark.REMARK_CONTENTS
      } else {
        this.remarkCd = this.$getUuid()
        this.remarkContent = ''
      }
    },
    data: function () {
      return {
        remarkCd: '',
        remarkContent: ''
      }
    },
    methods: {
      onOk (evt) {
        console.log('onOk')
        this.EventBus.$emit('MODIFY_REMARK', {remarkCd: this.remarkCd, remarkContent: this.remarkContent})
        this.$emit('close')
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
