<template>
  <div class="container">
    <div class="modalTitle">
      <span>Information</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <b-row>
        <b-col cols="2">
          <img v-if="level === '2'" src="~@/assets/icon/error.png" style="width: 80px;" />
          <img v-else src="~@/assets/icon/warning.png" style="width: 80px;" />
        </b-col>
        <b-col cols="10" class="pl-5">
          <div v-if="level === '2'" style="font-weight: bold;">
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Type
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col class="textOverflowEllipse">
                Error
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Code
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col class="textOverflowEllipse">
                {{ code }}
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Name
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col>
                {{ message }}
              </b-col>
            </b-row>
          </div>
          <div v-else style="font-weight: bold;">
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Type
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col class="textOverflowEllipse">
                Warning
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Code
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col class="textOverflowEllipse">
                {{ code }}
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="pr-0">
                Alarm Name
              </b-col>
              <b-col cols="1">
                :
              </b-col>
              <b-col>
                {{ message }}
              </b-col>
            </b-row>
          </div>
          <!-- <p v-html="modalContent"></p> -->
        </b-col>
      </b-row>
      <div class="text-right mt-3">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal-info',
    props: [
      'code',
      'message',
      'path',
      'level'
    ],
    mounted () {
    },
    data: function () {
      return {
        modalContent: ''
      }
    },
    methods: {
      onOk (evt) {
        if (this.path !== null && typeof(this.path) !== 'undefined') {
          this.$router.push({path: this.path})
        }
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
