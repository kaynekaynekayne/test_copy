<template>
  <div class="container">
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <progress-bar
        bar-color="green"
        text-fg-color="blue"
        text-align="left"
        max="100"
        :val="progressValue"
        :text="progressText"
        text-position="top"
        size="medium">
      </progress-bar>
    </div>
  </div>
</template>

<script>
  import ProgressBar from 'vue-simple-progress'

  export default {
    name: 'modal-progress',
    components: {
      ProgressBar
    },
    beforeDestroy () {
      this.EventBus.$off('VERSION_UPDATE_CHECK')
      this.EventBus.$off('COPY_FILES')
    },
    data: function () {
      return {
        progressValue: 0,
        progressText: ''
      }
    },
    mounted () {
      var self = this

      this.EventBus.$on('VERSION_UPDATE_CHECK', function(params) {
        console.log(params)
        self.progressValue = params.value
        self.progressText = params.text
      })
      this.EventBus.$on('COPY_FILES', function(params) {
        console.log(params)
        self.progressValue = params.value
        self.progressText = params.text
      })
    }
  }
</script>

<style>
</style>
