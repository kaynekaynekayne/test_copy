<template>
  <b-container id="testPage" fluid>
    <b-row>
      <b-col class="colbox" cols="3">
        <exec-controller></exec-controller>
        <processing-info></processing-info>
        <order-list></order-list>
      </b-col>
      <b-col class="colbox" cols="9">
        <b-row>
          <b-col class="pr-2" cols="3">
            <processing-panel></processing-panel>
          </b-col>
          <b-col class="pl-0">
            <test-results></test-results>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mt-2">
            <founding-cells></founding-cells>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ExecController from './Test/ExecController'
  import OrderList from './Test/OrderList'
  import ProcessingPanel from './Test/ProcessingPanel'
  import TestResults from './Test/TestResults'
  import FoundingCells from './Test/FoundingCells'
  import ProcessingInfo from './Test/ProcessingInfo'

  export default {
    name: 'test-page',
    components: { ExecController, OrderList, ProcessingPanel, TestResults, FoundingCells, ProcessingInfo }
  }
</script>
<style>
  #testPage {
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
