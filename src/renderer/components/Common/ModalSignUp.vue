<template>
  <div class="container">
    <div class="btnClose text-right">
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer" @click="onClose" />
    </div>
    <div class="modalTitle text-center">
      CREATE ACCOUNT
    </div>
    <div class="modalContent mt-3 pb-3">
      <div id="createAccWrapper" class="pl-5 pr-5 mt-3">
        <div class="form-group">
          <label for="newUserId">New user ID</label>
          <b-form-input type="text" v-b-popover.hover.top="msgCheckUserId" id="newUserId" v-model="modelObj.newUserId" :state="inputsState.newUserIdState" placeholder="New user ID" @input="onInputSignupForm('newUserId')"></b-form-input>
        </div>
        <div class="form-group">
          <label for="modalPwd">Password</label>
          <b-form-input type="password" v-b-popover.hover.top="msgCheckPassword" id="modalPwd" v-model="modelObj.password" :state="inputsState.passwordState" placeholder="Password" @input="onInputSignupForm('modalPwd')"></b-form-input>
        </div>
        <div class="form-group">
          <label for="modalRepeatPwd">Repeat your password</label>
          <b-form-input type="password" v-b-popover.hover.top="msgCheckPassword" id="modalRepeatPwd" v-model="modelObj.confirmPassword" :state="inputsState.confirmPasswordState" placeholder="Repeat your password" @input="onInputSignupForm('modalRepeatPwd')"></b-form-input>
        </div>
        <div class="form-group">
          <label for="name">Full name</label>
          <b-form-input type="text" id="name" v-model="modelObj.fullName" :state="inputsState.fullNameState" placeholder="Full name" @input="onInputSignupForm('name')"></b-form-input>
        </div>
        <div class="form-group">
          <b-row>
            <b-col>
              <label for="employeeNo">Employee No.</label>
              <b-form-input type="text" id="employeeNo" v-model="modelObj.employeeNo" :state="inputsState.employeeNoState" placeholder="Employee No." @input="onInputSignupForm('employeeNo')"></b-form-input>
            </b-col>
            <b-col>
              <label>User Authority</label>
              <b-form-select v-model="modelObj.userAuthority" :options="options"></b-form-select>
            </b-col>
          </b-row>
        </div>
        <!-- <div class="form-group">
          <label>Position</label>
          <b-form-select class="customSelect" v-model="modelObj.position" :options="positionList"></b-form-select>
        </div> -->
        <div>
          <!-- <b-row>
            <b-col class="p-0 text-right" cols="1">
              <img v-if="modelObj.isAgreeTerms === false" src="~@/assets/login/ic_error_red_48dp.png" class="pb-1" style="width: 20px;"/>
            </b-col>
            <b-col class="pl-1 pr-1">
              <b-form-checkbox
                v-if="modelObj.isAgreeTerms === false"
                id="agree"
                v-model="modelObj.isAgreeTerms"
                name="agree"
                class="colorRed"
              >
                I agree all statements in teams rule.
              </b-form-checkbox>
              <b-form-checkbox
                v-else
                id="agree"
                v-model="modelObj.isAgreeTerms"
                name="agree"
              >
                I agree all statements in teams rule.
              </b-form-checkbox>
            </b-col>
          </b-row> -->
        </div>
      </div>
      <div class="text-center mt-4">
        <div></div>
        <b-button id="btnCreateAccount" class="custom-blue-btn" @click="createAccount">CREATE ACCOUNT</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-signup',
    computed: {
      ...mapGetters([Constant.GET_COMMON_CODE_LIST])
    },
    mounted() {
      // Get position list
      var codeList = this.getCommonCodeList(Constant.GET_CODE_LIST_USER_POSITION)
      for (var i = 0; i < codeList.length; i++) {
        this.positionList.push({value: codeList[i].cd, text: codeList[i].cdNm})
      }
    },
    data: function () {
      return {
        modelObj: {
          newUserId: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          employeeNo: '',
          position: '00',
          // isAgreeTerms: false,
          userAuthority: '01'
        },
        inputsState: {
          newUserIdState: false,
          passwordState: false,
          confirmPasswordState: false,
          fullNameState: false,
          employeeNoState: false
        },
        isSaveMe: false,
        msgCheckUserId: Constant.IDS_ERROR_CHECK_ID,
        msgCheckPassword: Constant.IDS_ERROR_CHECK_PASSWORD,
        positionList: [],
        options: [
          { value: '01', text: 'Normal' },
          { value: '02', text: 'Admin' }
        ]
      }
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      createAccount (evt) {
        // 필수 입력값 체크
        if (!this.inputsState.newUserIdState || !this.inputsState.passwordState ||
            !this.inputsState.confirmPasswordState || !this.inputsState.fullNameState ||
            !this.inputsState.employeeNoState || // !this.modelObj.isAgreeTerms ||
             this.modelObj.position === '') {

          this.$toasted.show(Constant.IDS_ERROR_SIGINUP, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          var self = this
          var encText = this.$CryptoJS.AES.encrypt(this.modelObj.password, this.modelObj.password).toString()

          var userData = {
            userId: this.modelObj.newUserId.trim(),
            encPassword: encText.trim(),
            userName: this.modelObj.fullName.trim(),
            empNo: this.modelObj.employeeNo.trim(),
            position: this.modelObj.position.trim(),
            authCd: this.modelObj.userAuthority,
            createDttm: this.$getDateTimeStr(),
            modifyDttm: this.$getDateTimeStr(),
            loginDttm: '',
            isAvailable: 'Y'
          }

          ipcRenderer.send(Constant.SET_USER, JSON.stringify(userData))
          self.$store.dispatch('addUser', userData)
          self.$emit('close') // close popup

          ipcRenderer.once(Constant.SET_USER, function(event, result) {
            console.log(result)
            if (result.errorCode === 'E0000') {
              self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                position: 'bottom-center',
                duration: '2000'
              })
            } else {
              self.$toasted.show(result.errorMessage, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
          // ipcRenderer.send(Constant.IS_REGIST_USER, JSON.stringify(userData))
          // ipcRenderer.once(Constant.IS_REGIST_USER, function (event, result) {
          //   if (!result.IS_REGIST) {
          //     ipcRenderer.send(Constant.SET_USER, JSON.stringify(userData))
          //     self.$store.dispatch('addUser', userData)
          //     self.$emit('close')
          //   } else {
          //     self.$toasted.show(Constant.IDS_ERROR_SIGINUP_ALREADY_ID, {
          //       position: 'bottom-center',
          //       duration: '2000'
          //     })
          //   }
          // })
        }
      },
      onInputSignupForm (inputType) {
        if (inputType === 'newUserId') {
          if (this.modelObj.newUserId === '') {
            this.inputsState.newUserIdState = false
            this.msgCheckUserId = Constant.IDS_ERROR_CHECK_ID
          } else {
            if (this.$checkUserId(this.modelObj.newUserId)) {
              this.inputsState.newUserIdState = true
              this.msgCheckUserId = Constant.IDS_MSG_SUCCESS
            } else {
              this.inputsState.newUserIdState = false
              this.msgCheckUserId = Constant.IDS_ERROR_CHECK_ID
            }
          }
        } else if (inputType === 'modalPwd') {
          if (this.modelObj.password === '') {
            this.inputsState.passwordState = false
          } else {
            if (this.$checkPassword(this.modelObj.password)) {
              if (this.modelObj.password !== this.modelObj.confirmPassword) {
                this.inputsState.passwordState = false
                this.msgCheckPassword = Constant.IDS_ERROR_NOT_MATCHED_PASSWORD
              } else {
                this.inputsState.passwordState = true
                this.inputsState.confirmPasswordState = true
                this.msgCheckPassword = Constant.IDS_MSG_SUCCESS
              }
            } else {
              this.inputsState.passwordState = false
              this.msgCheckPassword = Constant.IDS_ERROR_CHECK_PASSWORD
            }
          }
        } else if (inputType === 'modalRepeatPwd') {
          if (this.modelObj.confirmPassword === '') {
            this.inputsState.confirmPasswordState = false
          } else {
            if (this.$checkPassword(this.modelObj.confirmPassword)) {
              if (this.modelObj.password !== this.modelObj.confirmPassword) {
                this.inputsState.confirmPasswordState = false
                this.msgCheckPassword = Constant.IDS_ERROR_NOT_MATCHED_PASSWORD
              } else {
                this.inputsState.confirmPasswordState = true
                this.inputsState.passwordState = true
                this.msgCheckPassword = Constant.IDS_MSG_SUCCESS
              }
            } else {
              this.inputsState.confirmPasswordState = false
              this.msgCheckPassword = Constant.IDS_ERROR_CHECK_PASSWORD
            }
          }
        } else if (inputType === 'name') {
          if (this.modelObj.fullName === '') {
            this.inputsState.fullNameState = false
          } else {
            this.inputsState.fullNameState = true
          }
        } else if (inputType === 'employeeNo') {
          if (this.modelObj.employeeNo === '') {
            this.inputsState.employeeNoState = false
          } else {
            this.inputsState.employeeNoState = true
          }
        }
      }
    }
  }
</script>

<style>
</style>
