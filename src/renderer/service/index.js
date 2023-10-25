import LisApi0002 from './LisApi_0002'
import LisApi0007 from './LisApi_0007'
import LisApi0011 from './LisApi_0011'
import LisApiCommon from './LisApiCommon'
import FileManager from './FileManager'
import IaServer from './IaServer'
import NCloud from './NCloud'

export default {
  async getCdcResults_0002 (bcno) {
    return await LisApi0002.getCdcResults_0002(bcno)
  },
  async checkUserAuth_0002 (empNo) {
    return await LisApi0002.checkUserAuth_0002(empNo)
  },
  async uploadReport_0002 (params) {
    return await LisApi0002.uploadReport_0002(params)
  },
  async getCdcResults_0007 (bcno) {
    return await LisApi0007.getCdcResults_0007(bcno)
  },
  async uploadReport_0007 (params) {
    return await LisApi0007.uploadReport_0007(params)
  },
  async commitReport_0007 (params) {
    return await LisApi0007.commitReport_0007(params)
  },
  async createOrder_0007 (params) {
    return await LisApi0007.createOrder_0007(params)
  },
  async getWorkList_0007 (params) {
    return await LisApi0007.getWorkList_0007(params)
  },
  async getWorkList_Date_0007 (params) {
    return await LisApi0007.getWorkList_Date_0007(params)
  },
  async getCdcResults_0011 (params) {
    return await LisApi0011.getCdcResults_0011(params)
  },
  async uploadReport_0011 (params) {
    return await LisApi0011.uploadReport_0011(params)
  },
  async uploadReport (params) {
    return await LisApiCommon.uploadReport(params)
  },
  async getCdcResults (params) {
    return await LisApiCommon.getCdcResults(params)
  },
  async getWbcFiles (params) {
    return await FileManager.getWbcFiles(params)
  },
  async getRbcFiles (params) {
    return await FileManager.getRbcFiles(params)
  },
  async createDir(params) {
    return await FileManager.createDir(params, endPoint)
  },
  async copyDir(params, endPoint) {
    return await FileManager.copyDir(params, endPoint)
  },
  async getWbcClassification (params) {
    return await FileManager.getWbcClassification(params)
  },
  async moveFile (params) {
    return await FileManager.moveFile(params)
  },
  async sendDeviceUse (params, endPoint) {
    return await IaServer.sendDeviceUse(params, endPoint)
  },
  async getPolicy(params, endPoint) {
    return await IaServer.getPolicy(params, endPoint)
  },
  async sendErrorCode(params, endPoint) {
    return await IaServer.sendErrorCode(params, endPoint)
  },
  async createBucket(params) {
    return await NCloud.createBucket(params)
  },
  async listBuckets(params) {
    return await NCloud.listBuckets(params)
  },
  async uploadStorage(params, options) {
    return await NCloud.uploadStorage(params, options)
  },
  async putObject(params) {
    return await NCloud.putObject(params)
  },
  async uploadDirectory(params) {
    return await NCloud.uploadDirectory(params)
  },
  async removeMultipartUploads(params) {
    return await NCloud.removeMultipartUploads(params)
  }
}
