const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

export default Object.freeze({
  HOST_NAME: '127.0.0.1',
  PORT: '11235',
  INTERFACE_PATH: env.LOCALAPPDATA + '\\Programs\\UIMD\\UIMD_Backend_Install',
  INTERFACE_FILE_NM: 'UIMD_Backend.exe',

  //\\UIMD_Backend.exe
  // INTERFACE_PATH: 'C:\\Program Files\\Sublime Text 3',
  // INTERFACE_FILE_NM: 'sublime_text.exe',

  DB_PATH: 'Programs/UIMD_PB_IA/resources/app.asar/src/main/database',
  // DB_BACKUP_PATH: 'D:/IA_Proc/tmp.db',
  // DB_FILE_NAME: 'D:/UIMD_Data/UI_DB/pb.db',
  DB_FILE_NAME: 'UIMD_Data/UI_DB/pb.db',
  DB_FILE_PATH: 'UIMD_Data/UI_DB',
  DB_CONFIG_PATH: 'D:/UIMD_Data/UI_DB/db_config.json',
  API_VERSION: '/api/v1/',
  N_CLOUD_BASE_URL: 'https://kr.object.ncloudstorage.com',
  LATEST_OBJECT_NAME: 'latest.yml',
  REGION: 'kr-standard',
  DOWNLOAD_PATH: 'D:/UIMD_Data/download',
  DOWNLOAD_BACKEND_PATH: env.LOCALAPPDATA + '\\Programs\\UIMD\\UIMD_Backend_Install',
  DOWNLOAD_TASK_PATH: 'D:\\UIMD_Data\\download',
  NACCESS_KEY: '4XfPlHYUaIT3H5OrRZrI',
  NSECRET_KEY: 'ldDLztdUBQKSV5u6vjRbd14hwPF6mHYqbEu9x3Mu',

  IS_BF_MODE_ON: 'Y',

  SKMC_LIS_PATH: 'D:/UIMD_Data/UI_DB/lis/skmclis.jar',

  BUCKET_RESULT: 'pb-ia-result',

  // TEST
  // BUCKET_NAME: 'uimd-pb-test'

  // 서울 성모 병원
  // BUCKET_NAME: 'pb-082-0001'
  // 여의도 성모 병원
  // BUCKET_NAME: 'pb-082-0002'
  // 이원 의료재단
  // BUCKET_NAME: 'pb-082-0003'
  // 일산 병원
  // BUCKET_NAME: 'pb-082-0004'
  // 고대 안암 병원
  // BUCKET_NAME: 'pb-082-0005'
  // 삼광 의료 재단
  // BUCKET_NAME: 'pb-082-0006'
  // 부산 대학 병원
  // BUCKET_NAME: 'pb-082-0007'
  // 인하대
  // BUCKET_NAME: 'pb-082-0008'
  // 녹십자
  // BUCKET_NAME: 'pb-082-0009'

  // 스타고
  // BUCKET_NAME: 'pb-033-0001'

  // communite
  BUCKET_NAME: 'uimd-pb-comm'

})
