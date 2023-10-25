<template>
  <div class="container">
    <div class="modalTitle"></div>
    <div class="modalContent pb-3 pl-3 pr-3" style="height: 600px; overflow-x: none; overflow-y: scroll;">
      <b-row>
        <b-col>
          <b-form-datepicker
            id="sheetDate"
            size="sm"
            v-model="sheetDate"
            placeholder="검사일자"
            @input="onSearch"
            :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
          ></b-form-datepicker>
        </b-col>
        <!-- <b-col>
          <b-button variant="outline-primary" @click="onSearch" size="sm">Search</b-button>
        </b-col> -->
      </b-row>
      <div v-if="sheetList.length <= 0" class="text-center mt-3">
        <b-row>
          <b-col>
            Search date...
          </b-col>
        </b-row>
      </div>
      <div v-else class="text-center mt-3">
        <b-row style="font-size: 16px;">
          <b-col>
            No.
          </b-col>
          <b-col>
            접수일자
          </b-col>
          <b-col>
            검사일자
          </b-col>
          <b-col>
            <b-row class="p-0">
              <b-col class="p-0" cols="8">
                <span>접수번호</span>
              </b-col>
              <b-col class="p-0">
                <span>
                  <b-icon v-if="isJsnoDesc" class="pointer"
                    icon="caret-down"
                    @click="onClickDesc"
                  >
                  </b-icon>
                  <b-icon v-else class="pointer"
                    icon="caret-up"
                    @click="onClickAsc"
                  >
                  </b-icon>
                </span>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            결과코드
          </b-col>
          <b-col>
            환자명
          </b-col>
          <b-col>
            검사여부
          </b-col>
        </b-row>
        <hr />
        <b-row v-bind:class="{colorBlueTitle: sheet.IS_TEST === 'N'}" class="mt-2" v-for="sheet, index in sheetList" :key="index" style="font-size: 14px;">
          <b-col>
            {{ index + 1 }}
          </b-col>
          <b-col>
            {{ $stringToDate(sheet.I03JSDT) }}
          </b-col>
          <b-col>
            {{ $stringToDate(sheet.I03KSDT) }}
          </b-col>
          <b-col>
            {{ sheet.I03JSNO }}
          </b-col>
          <b-col>
            {{ sheet.I03YYCD }}
          </b-col>
          <b-col>
            {{ sheet.I03PTNM }}
          </b-col>
          <b-col>
            {{ sheet.IS_TEST }}
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="text-right pb-3">
      <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
      <b-button class="custom-blue-btn" @click="onCancel" size="sm">CANCEL</b-button>
    </div>
  </div>
</template>

<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'
  import api from '@/service'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-work-sheet',
    props: ['testList'],
    computed: {
      ...mapGetters({
      })
    },
    beforeDestroy () {
    },
    mounted () {
      var now = new Date()

      var year = "" + now.getFullYear()
      var month = "" + (now.getMonth() + 1)
      var day = "" + now.getDate()

      if (month.length == 1) {
        month = "0" + month
      }

      if (day.length == 1) {
        day = "0" + day
      }

      this.sheetDate = year + '-' + month + '-' + day

      console.log(this.testList)
      this.onSearch()
    },
    data () {
      return {
        sheetDate: '',
        sheetList: [],
        isJsnoDesc: true
      }
    },
    methods: {
      onClickDesc () {
        this.isJsnoDesc = false
        this.sheetList.sort(function(a, b) {
          return a.I03JSNO - b.I03JSNO
        })
      },
      onClickAsc () {
        this.isJsnoDesc = true
        this.sheetList.sort(function(a, b) {
          return b.I03JSNO - a.I03JSNO
        })
      },
      onSearch () {
        console.log('onSearch')
        console.log(this.sheetDate)

        var self = this
        var params = {
          sheetDate: this.sheetDate.replace(/-/gi, '')
        }

        console.log(params)

        api.getWorkList_Date_0007(params)
        .then(function (res) {
          console.log(res)

          if (res.data.errorCode === 'E0000') {
            self.sheetList = []
            var sheetTmp = res.data.results

            sheetTmp.forEach(function(sheet) {
              sheet.I03CUCD = sheet.I03CUCD.trim()
              sheet.I03CUNM = sheet.I03CUNM.trim()
              sheet.I03GSNM = sheet.I03GSNM.trim()
              sheet.I03JSDT = sheet.I03JSDT.trim()
              sheet.I03JSNO = sheet.I03JSNO.trim()
              sheet.I03KCCD = sheet.I03KCCD.trim()
              sheet.I03KCNM = sheet.I03KCNM.trim()
              sheet.I03KSDT = sheet.I03KSDT.trim()
              sheet.I03PTNM = sheet.I03PTNM.trim()
              sheet.I03SDAT = sheet.I03SDAT.trim()
              sheet.I03SEXX = sheet.I03SEXX.trim()
              sheet.I03STIM = sheet.I03STIM.trim()
              sheet.I03YYCD = sheet.I03YYCD.trim()
              sheet.I01BARC = sheet.I01BARC.trim()
              sheet.IS_TEST = 'N'

              var findList = self.testList.filter(function(testItem) {
                return testItem.BARCODE_NO.substr(4, 5) === sheet.I03JSNO
              })
              console.log(findList)

              // sheet.IS_TEST = 'N'
              // if (sheet.I01BARC !== 'N') {
              //   sheet.IS_TEST = 'Y'
              // }

              // 2023_07_03 : 장비에서 실행된 바코드로 (원복)
              if (findList.length > 0) {
                sheet.IS_TEST = 'Y'
              }

              self.sheetList.push(sheet)
            })

            if (self.isJsnoDesc) {
              self.onClickDesc()
            } else {
              self.onClickAsc()
            }
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      onOk (evt) {
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
