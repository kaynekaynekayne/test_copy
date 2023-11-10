<template>
  <div id="barcodeContainer" class="container p-0">
    <div id="barcodeTop" class="pt-3 pb-3 pl-3 pr-3">
      <div>
        <img src="~@/assets/icon/reg1.png" />
        <span id="barcodeTitle">PBIA ACTIVATION</span>
      </div>
      <div class="text-center pt-4">
        <img src="~@/assets/icon/reg_back.png" />
        <div style="color: white; font-size: 18px;">Register a new card</div>
      </div>
    </div>

    <div id="barcodeBottom" class="pt-3 pb-5 pl-5 pr-5">
      <b-row v-for="card, index in activationCards" class="mt-5 colorWhite" :key="index">
        <!-- <b-col class="text-left">
          {{ card.cardName }}
        </b-col>
        <b-col class="text-center">
          {{ card.cardCount }}
        </b-col> -->
      </b-row>
      <div class="w-100 pb-4" style="border-top: 1px solid white;"></div>
      <b-row>
        <b-form-input type="text" placeholder="barcode number" v-model="barcodeInput" style="color: white; background-color: rgba(255, 255, 255, 0.2); border: none;"></b-form-input>
      </b-row>

      <!-- <b-row class="mt-5 colorWhite">
        <b-col class="text-left">
          Standard Count
        </b-col>
        <b-col class="text-center">
          {{ standardRemainingCount }}
        </b-col>
      </b-row>
      <b-row class="mt-2 colorWhite">
        <b-col class="text-left">
          Premium Count
        </b-col>
        <b-col class="text-center">
          {{ premiumRemainingCount }}
        </b-col>
      </b-row> -->

      <b-row class="text-center mt-5">
        <b-col>
          <b-button class="w-100" variant="outline-light" size="sm" @click="onRegister">Register</b-button>
        </b-col>
        <b-col>
          <b-button class="w-100" variant="outline-light" size="sm" @click="onCancel">Cancel</b-button>
        </b-col>
      </b-row>
    </div>

  </div>
</template>
<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'
  import worker from '../../workers/promise'

  export default {
    name: 'modal-barcode-scan',
    computed: {
      ...mapGetters({
        sysInfo: Constant.GET_SYS_INFO,
        currentUser: Constant.GET_CURRENT_USER,

      })
    },
    watch: {
      activationCards: function(newVal, oldVal) {
        this.activationCards = this.sysInfo.activationCards
      }
    },
    data: function () {
      return {
        activationCards: [],
        barcodeInput: ''
      }
    },
    beforeDestroy () {
      var self = this
      // remove EventBus
      // this.EventBus.$off('RECEIVE_DATA_BARCODE_SYSINFO')
      this.$store.dispatch(Constant.SET_IS_SHOW_MODAL_BARCODE, false)
    },
    mounted () {
      var self = this

      // this.EventBus.$on('RECEIVE_DATA_BARCODE_SYSINFO', function(params) {
      //   self.activationCards = params.activationCards
      // })

      this.$store.dispatch(Constant.SET_IS_SHOW_MODAL_BARCODE, true)
    },
    methods: {
      onCancel () {
        console.log('onCancel')
        this.$emit('close')
      },
      onRegister () {
        console.log("on register")
        if (this.barcodeInput) {
          this.sendBarcodeReg(this.barcodeInput)
        } else {
            // this.$toasted.show(Constant.IDS_PLEASE_ENTER_YOUR_BARCODE_NUMBER, {
            //   position: 'bottom-center',
            //   duration: '2000'
            // })
            return
        }
      },
      sendBarcodeReg(barcodeNo) {
        console.log(barcodeNo)

        var deviceBarcodeNo = barcodeNo.substr(0,12)
        var type = barcodeNo.substr(12,2)
        var count = barcodeNo.substr(14,10)

        console.log(deviceBarcodeNo)
        console.log(type)
        console.log(count)

        //바코드 regist
        var params = {
          jobCmd: 'BARCODE_REG',
          deviceBarcodeNo,
          type,
          count,
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        console.log(this)
        console.log(params)
        //{jobCmd: "BARCODE_REG", deviceBarcodeNo: "673745645645", type: "65", count: "4", reqUserId: "eeeee", …}

        worker.sendDataToServer(this, JSON.stringify(params))
      }
    }
  }
</script>

<style>
  #barcodeTop {
    background-color: #272727;
  }
  #barcodeBottom {
    background-color: #272727;
  }
  #barcodeTitle {
    color: #2578AD;
    font-size: 20px;
    margin-left: 10px;
  }
</style>
