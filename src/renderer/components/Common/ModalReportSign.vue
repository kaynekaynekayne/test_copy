<template>
  <div class="container">
    <b-row class="border-bottom">
      <b-col cols="7">
        <div class="modalTitle text-left">
          <span>PB-IA</span>
        </div>
      </b-col>
      <b-col>
        <div class="btnClose text-right mt-2">
          <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer" @click="onClose" />
        </div>
      </b-col>
    </b-row>

    <div class="modalContent mt-3 pb-3">
      <div>
        <label class="colorGray" for="input-live" readonly>USER ID</label>
        <b-form-input
          id="input-live"
          type="text"
          v-model="userId"
          :state="nameState"
          aria-describedby="input-live-feedback-id"
          placeholder="Enter your login id"
          trim
        ></b-form-input>

        <b-form-invalid-feedback id="input-live-feedback-id">
          Enter your login id
        </b-form-invalid-feedback>
      </div>
      <div class="mt-3">
        <label class="colorGray" for="input-live">PASSWORD</label>
        <b-form-input
          id="input-live"
          type="password"
          v-model="password"
          placeholder="Enter your paswsword"
        ></b-form-input>
      </div>
      <!-- <div class="mt-2">
        <div class="colorGray" style="font-size: 13px;">* NOTICE</div>
        <div class="colorRed" style="font-size: 12px;">After signing the final result, it cannot be modified.</div>
      </div> -->
      <div class="mt-3 text-right">
        <b-button variant="primary" @click="onSign">Submit</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-sign',

    data: function () {
      return {
        userId: '',
        password: ''
      }
    },
    props: ['slotId'],
    computed: {
      nameState () {
        // 로그인 사용자 ID 체크
        if (this.currentUser.userId !== this.userId) {
          return false
        } else {
          return true
        }
      },
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onSign (evt) {
        console.log(this.nameState)
        if (!this.nameState) {
          this.$toasted.show(Constant.IDS_ERROR_LOGIN_ID, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // 패스워드 체크
        if (this.password !== null && this.password !== '') {
          var user = this.$store.getters.getUser(this.currentUser.userId)
          var decPassword = this.$CryptoJS.AES.decrypt(user.encPassword, this.password).toString(this.$CryptoJS.enc.Utf8)

          console.log(this.password)
          console.log(decPassword)
          if (decPassword !== this.password) {
            this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
              position: 'bottom-center',
              duration: '2000'
            })
          } else {
            this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })

            // 로그 저장
            // var logObj = {}
            // logObj.userId = this.currentUser.userId
            // logObj.eventTypeCd = Constant.EVENT_TYPE_USER
            // logObj.logDttm = this.$getDateTimeStr()
            // logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + ']' + '[' + this.slotId + '] ' + 'Signed'

            // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

            // db update
            var obj = {}
            obj.state = 'Submit'
            obj.slotId = this.slotId
            obj.userId = this.currentUser.userId

            ipcRenderer.send(Constant.UPDATE_SIGNED_STATE, JSON.stringify(obj))

            this.$emit('close')
            this.$router.push({path: '/homePage/result'})
          }
        } else {
          this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      }
    }
  }
</script>

<style>
</style>
