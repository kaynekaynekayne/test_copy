<template>
  <div class="container">
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div id="printModal" class="printContent" v-html="htmlContent">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal-print',
    props: [
      'item'
    ],
    data: function () {
      return {
        htmlContent: this.item,
        tempSection: ''
      }
    },
    beforeDestroy () {
      document.body.removeChild(this.tempSection)
    },
    mounted () {
      var section = document.getElementById('printModal')

      this.tempSection = section.cloneNode(true)
      this.tempSection.id = ('print')
      document.body.appendChild(this.tempSection)

      setTimeout(function () {
        window.print()
      }, 500)
    }
  }
</script>

<style>
  @media screen {
    /* #print {
      display: none;
    } */
  }

  @media print {
    body * {
      visibility: hidden;
    }
    #print, #print * {
      visibility: visible;
    }
    #print {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
