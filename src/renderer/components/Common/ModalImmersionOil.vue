<template>
  <div class="container p-0">
    <div class="pt-2 pl-3" style="font-size: 18px;">
      <!-- <img src="~@/assets/icon/ic_opacity_white.png" class="pointer" style="width: 5%;"/> -->
      <span>Immersion Oil</span>
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div class="border p-2">
        <h5>Immersion Oil count Reset</h5>
        <span class="colorGray">Reset Immersion Oil count after changing Oil pack</span>
        <b-row class="mt-3">
          <b-col cols="8">
            <span>Estimated number of slides left</span>
          </b-col>
          <b-col class="text-center">
            <div class="border ml-5" style="width: 80px;">{{ cpOilCount }}</div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col cols="8">
            <div id="statusBarWrapper">
              <div id="statusBar">
              </div>
            </div>
          </b-col>
          <b-col class="text-center">
            <b-button id="btnReset" variant="primary" size="sm" @click="onReset">RESET</b-button>
          </b-col>
        </b-row>
      </div>
      <div class="border p-2 mt-3">
        <h5>Prime Immersion Oil</h5>
        <span class="colorGray">Prime oil to remove air from the oil hose</span>
        <b-row class="mt-3">
          <b-col cols="8">
            <div id="statusBarWrapper">
            </div>
          </b-col>
          <b-col class="text-center">
            <b-button id="btnPrime" variant="primary" size="sm" @click="onPrime">PRIME</b-button>
          </b-col>
        </b-row>
      </div>
      <div class="text-right mt-2">
        <b-button variant="outline-dark" size="sm" @click="onClose">Close</b-button>
      </div>
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'
  import worker from '../../workers/promise'

  export default {
    name: 'modal-immersion-oil',
    props: [
      'oilCount'
    ],
    computed: {
      ...mapGetters({
        getSettings: Constant.GET_SETTINGS,
        getCurrentUser: Constant.GET_CURRENT_USER
      })
    },
    data: function () {
      return {
        cpOilCount: ''
      }
    },
    mounted () {
      this.cpOilCount = this.oilCount
      this.getPercent()
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onOk (evt) {
        this.$emit('close')
      },
      onPrime (evt) {
        console.log('onPrime')
        this.sendOilPrime()
        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      },
      onReset (evt) {
        this.cpOilCount = this.getSettings.maxOilCount
        this.$store.dispatch(Constant.INIT_OIL_COUNT)
        this.getPercent()
        this.EventBus.$emit('INIT_OIL_COUNT')
        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      },
      getPercent () {
        var percent = Number(((this.cpOilCount / this.getSettings.maxOilCount) * 100).toFixed(0))
        document.getElementById('statusBar').style.width = document.getElementById('statusBarWrapper').offsetWidth * (percent / 100) + 'px'
      },
      sendOilPrime () {
        var params = {
          jobCmd: 'OIL_PRIME',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      }
    }
  }
</script>

<style>
  #btnReset {
    width: 80px;
    margin-left: 15px;
  }
  #btnPrime {
    width: 80px;
    margin-left: 15px;
  }
  #statusBarWrapper {
    width: 100%;
    height: 20px;
    margin-top: 5px;
    background-color: #063E5F;
  }
  #statusBar {
    width: 80%;
    height: 20px;
    margin-top: 5px;
    background-color: #0080C1;
  }
</style>
