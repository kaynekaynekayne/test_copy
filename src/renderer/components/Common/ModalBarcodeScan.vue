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
      <div class="w-100" style="border-top: 1px solid white;"></div>
      <b-row v-for="card, index in activationCards" class="mt-5 colorWhite" :key="index">
        <b-col class="text-left">
          {{ card.cardName }}
        </b-col>
        <b-col class="text-center">
          {{ card.cardCount }}
        </b-col>
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
        <!-- <b-col>
          <b-button class="w-100" variant="outline-light" size="sm" @click="onRegister">Register</b-button>
        </b-col> -->
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
        sysInfo: Constant.GET_SYS_INFO
      })
    },
    watch: {
      activationCards: function(newVal, oldVal) {
        this.activationCards = this.sysInfo.activationCards
      }
    },
    data: function () {
      return {
        activationCards: []
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
