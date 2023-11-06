export default Object.freeze({
  SELECT_USER_LIST:
  `SELECT USER_ID
     , USER_NM
     , EMP_NO
     , POSITION
     , AUTH_CD
     , ENC_PWD
     , IS_AVAILABLE
     , LOGIN_DTTM
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
    FROM PB_DB.TB_USER
   WHERE 1=1`,

  UPDATE_USER_DTTM:
  `UPDATE PB_DB.TB_USER
    SET LOGIN_DTTM = ?
      , MODIFY_DTTM = ?
   WHERE USER_ID = ?`,

   //Ãß°¡
   UPDATE_USER:
   `UPDATE TB_USER
    SET AUTH_CD = ?
     , USER_NM = ?
     , IS_AVAILABLE = ?
     , EMP_NO = ?
     , MODIFY_DTTM = ?¤º
    WHERE USER_ID = ?`,
 

  INSERT_USER:
  `INSERT INTO PB_DB.TB_USER
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,

  IS_REGIST_USER:
  `SELECT (CASE WHEN (COUNT(1) > 0) THEN 1
  	        ELSE 0
           END) AS IS_REGIST
    FROM PB_DB.TB_USER
   WHERE USER_ID = ?`,

  SELECT_RBC_DEGREE:
  `SELECT CATEGORY_ID
     , CLASS_ID
     , DEGREE_1
     , DEGREE_2
     , DEGREE_3
    FROM PB_DB.TB_RBC_DEGREE_VAL
   WHERE 1=1`,

  UPDATE_RBC_DEGREE:
  `UPDATE TB_RBC_DEGREE_VAL
    SET DEGREE_1 = ?
     , DEGREE_2 = ?
     , DEGREE_3 = ?
   WHERE CATEGORY_ID = ?
      AND CLASS_ID = ?`,

  SELECT_NORMAL_RANGE:
  `SELECT ANALYSIS_TYPE
     , CLASS_ID
     , CLASS_TITLE
     , CLASS_NM
     , MIN
     , MAX
     , UNIT
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
    FROM TB_NORMAL_RANGE
   WHERE 1=1`,

  SELECT_CBC_CODE:
  `SELECT IA_CD
      , CBC_CD
      , CD_NM
      , IS_SELECTED
    FROM TB_CBC_TEST_CODE
   WHERE 1=1`,

  SELECT_LIS_CODE:
  `SELECT IA_CD
      , LIS_CD
      , CD_NM
      , MIN_COUNT
   FROM TB_LIS_TEST_CODE
  WHERE 1=1`,

  SELECT_LIS_CODE_RBC:
  `SELECT IA_CATEGORY_CD
       , IA_CLASS_CD
       , LIS_CD
       , CATEGORY_NM
       , CLASS_NM
    FROM TB_LIS_TEST_CODE_RBC
  WHERE 1=1`,

  SELECT_LIS_CONN_PATH:
  `SELECT DEVICE_BARCODE
      , LIS_FILE_PATH
      , LIS_URL
      , LIS_CONN_TYPE_CD
      , CBC_FILE_PATH
      , CBC_URL
      , CBC_CONN_TYPE_CD
    FROM TB_LIS_CONN_PATH
   WHERE 1=1
      AND DEVICE_BARCODE = ?`,

  SELECT_WBC_RUNNING_COUNT:
  `SELECT ID
      , MIN
      , MAX
      , COUNT
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
   FROM TB_WBC_RUNNING_COUNT
  WHERE 1=1`,

  SELECT_RBC_CLASSIFICATION:
  `SELECT TA.CASSET_ID
      , TA.SLOT_ID
      , TA.CATEGORY_ID
      , TA.CATEGORY_NM
      , TB.CLASS_ID
      , TB.CLASS_NM
      , TB.DEGREE
   FROM TB_RBC_CATEGORY TA
      , (SELECT *
          FROM TB_RBC_CLASSIFICATION
          WHERE SLOT_ID = ?
          ORDER BY CLASS_ID ASC
      ) TB
  WHERE TA.CASSET_ID = TB.CASSET_ID
      AND TA.SLOT_ID = TB.SLOT_ID
      AND TA.CATEGORY_ID = TB.CATEGORY_ID
      AND TA.SLOT_ID = ?
      ORDER BY TA.CATEGORY_ID ASC`,

  // TEST HISTORY
  INSERT_TEST_HISTORY:
  `INSERT INTO TB_TEST_HISTORY
      (CASSET_ID
      , SLOT_ID
      , SLOT_NO
      , BARCODE_NO
      , PATIENT_ID
      , PATIENT_NM
      , ORDER_DTTM
      , STATE_CD
      , MALARIA_COUNT
      , PLT_COUNT
      , ANALYZE_DTTM
      , BIRTHDAY
      , GENDER
      , TEST_TYPE
      , SIGNED_STATE
      , SIGNED_DTTM
      , SIGNED_USER_ID
      , WBC_COMMENT
      , RBC_COMMENT
      , MAX_WBC_COUNT
      , MAX_RBC_COUNT
      , SERIAL_NO
      , TACT_TIME
      , IS_NS_NB_INTEGRATION
      , IS_NORMAL
      , IS_CHECKED
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON DUPLICATE KEY UPDATE
    SLOT_NO         = ?
    , BARCODE_NO      = ?
    , PATIENT_ID      = ?
    , PATIENT_NM      = ?
    , ORDER_DTTM      = ?
    , STATE_CD        = ?
    , MALARIA_COUNT   = ?
    , PLT_COUNT       = ?
    , ANALYZE_DTTM    = ?
    , BIRTHDAY        = ?
    , GENDER          = ?
    , TEST_TYPE       = ?
    , SIGNED_STATE    = ?
    , SIGNED_DTTM     = ?
    , SIGNED_USER_ID  = ?
    , WBC_COMMENT     = ?
    , RBC_COMMENT     = ?
    , MAX_WBC_COUNT   = ?
    , MAX_RBC_COUNT   = ?
    , SERIAL_NO       = ?
    , TACT_TIME       = ?
    , IS_NS_NB_INTEGRATION  = ?
    , IS_NORMAL       = ?
    , IS_CHECKED      = ?
    , MODIFY_DTTM     = ?
    , MODIFY_ID       = ?`,

  INSERT_LIS_CODE:
  `INSERT INTO TB_LIS_TEST_CODE
    (IA_CD
    , LIS_CD
    , CD_NM
    , MIN_COUNT
    , CREATE_DTTM
    , CREATE_ID
    , MODIFY_DTTM
    , MODIFY_ID)
   VALUES (?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
    LIS_CD          = ?
    , CD_NM         = ?
    , MIN_COUNT     = ?
    , MODIFY_DTTM   = ?
    , MODIFY_ID     = ?`,

  INSERT_LIS_CODE_RBC:
  `INSERT INTO TB_LIS_TEST_CODE_RBC
    (IA_CATEGORY_CD
    , IA_CLASS_CD
    , LIS_CD
    , CATEGORY_NM
    , CLASS_NM
    , CREATE_DTTM
    , CREATE_ID
    , MODIFY_DTTM
    , MODIFY_ID)
  VALUES (?,?,?,?,?,?,?,?,?)
  ON DUPLICATE KEY UPDATE
    LIS_CD          = ?
    , CATEGORY_NM   = ?
    , CLASS_NM      = ?
    , MODIFY_DTTM   = ?
    , MODIFY_ID     = ?`,

  INSERT_WBC_RUNNING_COUNT:
  `INSERT INTO TB_WBC_RUNNING_COUNT
    (ID
    , MIN
    , MAX
    , COUNT
    , CREATE_DTTM
    , CREATE_ID
    , MODIFY_DTTM
    , MODIFY_ID)
   VALUES(?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
    MIN             = ?
    , MAX           = ?
    , COUNT         = ?
    , MODIFY_DTTM   = ?
    , MODIFY_ID     = ?`,

  INSERT_COMMON_CODE_GRP:
  `INSERT IGNORE INTO TB_COMMON_CODE_GRP
    VALUES('A00', 'hotkey type', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A01', 'analysis type', date_format(now(),'%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A02', 'connection type', date_format(now(),'%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  INSERT_COMMON_CODE:
  `INSERT IGNORE INTO TB_COMMON_CODE
    VALUES('A00', '01', 'WBC', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A00', '02', 'BF', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A01', '01', 'WBC', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A01', '02', 'RBC', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A01', '03', 'BF', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A01', '04', 'BM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A02', '01', 'file', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('A02', '02', 'http', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
  `,

  INSERT_DEFAULT_HOT_KEY:
  `INSERT IGNORE INTO TB_HOT_KEY
    VALUES ('01', '01', 'NE', 'Neutrophil',         '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '71', 'NS', 'Neutrophil-Segmented',  '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '72', 'NB', 'Neutrophil-Band',       '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '02', 'ME', 'Metamyelocyte',         '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '03', 'MY', 'Myelocyte',             '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '04', 'PR', 'Promyelocyte',          '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '05', 'LY', 'Lymphocyte',            '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '61', 'LR', 'Reactive lymphocyte',   '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '62', 'LA', 'Abnormal lymphocyte',   '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '07', 'MO', 'Monocyte',              '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '08', 'EO', 'Eosinophil',            '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '09', 'BA', 'Basophil',              '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '10', 'BL', 'Blast',                 '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '11', 'PC', 'Plasma cell',           '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '12', 'NR', 'nRBC',                  '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '13', 'GP', 'Giant platelet',        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '14', 'PA', 'Platelet aggregation',  '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '16', 'MA', 'Malaria',               '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '15', 'AR', 'Artifact(Smudge)',      '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '90', '', '',                        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '91', '', '',                        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '92', '', '',                        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '93', '', '',                        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '94', '', '',                        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '01', 'NE', 'Neutrophil',            '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '02', 'LY', 'Lymphocyte',            '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '03', 'MO', 'Monocyte',              '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '04', 'EO', 'Eosinophil',            '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '05', 'BA', 'Basophil',              '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '06', 'BL', 'Blast',                 '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '07', 'PC', 'Plasma cell',           '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '08', 'NR', 'NRBC',                  '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '09', 'AR', 'Artifact(Smudge)',      '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '10', 'MC', 'Malignant cell',        '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '11', 'MT', 'Mesothelial cell',      '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  INSERT_WBC_CUSTOM_CLASS:
  `INSERT IGNORE INTO TB_WBC_CUSTOM_CLASS
    VALUES('90', '', '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('91', '', '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('92', '', '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('93', '', '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('94', '', '', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  INSERT_DEFAULT_RBC_DEGREE:
  `INSERT IGNORE INTO TB_RBC_DEGREE_VAL
    VALUES('01', '02', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '03', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '04', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '02', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '03', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '04', 5, 10, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '03', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '04', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '05', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '06', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '07', 0.5, 1, 2, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '08', 0.5, 1, 2, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '09', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '10', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '11', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('05', '01', 1, 2, 3, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('05', '02', 2.5, 5, 20, date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  INSERT_DEFAULT_NORMAL_RANAGE:
  `INSERT IGNORE INTO TB_NORMAL_RANGE
    VALUES ('01', '01', 'NE', 'Neutrophil', '42', '85', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '02', 'ME', 'Metamyelocyte', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '03', 'MY', 'Myelocyte', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '04', 'PR', 'Promyelocyte', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '05', 'LY', 'Lymphocyte', '11', '49', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '61', 'LR', 'Reactive lymphocyte', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '62', 'LA', 'Abnormal lymphocyte', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '07', 'MO', 'Monocyte', '0', '9', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '08', 'EO', 'Eosinophil', '0', '6', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '09', 'BA', 'Basophil', '0', '2', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '10', 'BL', 'Blast', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '11', 'PC', 'Plasma cell', '0', '100', '%', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '12', 'NR', 'nRBC', '0', '100', 'Count', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '13', 'GP', 'Giant platelet', '0', '100', 'Count', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '14', 'PA', 'Platelet aggregation', '0', '100', 'Count', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '15', 'AR', 'Artifact(Smudge)', '0', '100', 'Count', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '16', 'MA', 'Malaria', '0', '100', 'Count', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  SELECT_BACKUP_LIST:
  `SELECT *
    FROM TB_TEST_HISTORY
   WHERE 1=1
     AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`,

  DELETE_USER:
  `DELETE
    FROM TB_USER
   WHERE USER_ID = ?`,

  UPDATE_NORMAL_RANGE:
  `UPDATE TB_NORMAL_RANGE
    SET MIN = ?
      , MAX = ?
      , UNIT = ?
   WHERE ANALYSIS_TYPE = ?
     AND CLASS_ID = ?`,

  UPDATE_LIS_CONN_PATH:
  `INSERT INTO TB_LIS_CONN_PATH
    (DEVICE_BARCODE
      , LIS_FILE_PATH
      , LIS_URL
      , LIS_CONN_TYPE_CD
      , CBC_FILE_PATH
      , CBC_URL
      , CBC_CONN_TYPE_CD
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID)
   VALUES(?,?,?,?,?,?,?,?,?,?,?)`,

  SELECT_WBC_CUSTOM_CLASS:
  `SELECT CLASS_ID
     , CLASS_TITLE
     , CLASS_NM
    FROM TB_WBC_CUSTOM_CLASS
   WHERE 1=1`,

  SELECT_HOT_KEY:
  `SELECT HOT_KEY_TYPE
     , CLASS_ID
     , CLASS_TITLE
     , CLASS_NM
     , HOT_KEY
    FROM TB_HOT_KEY
   WHERE 1=1
     AND CLASS_TITLE != ''`,

  SELECT_WBC_HOT_KEY:
  `SELECT A.HOT_KEY_TYPE
      , A.CLASS_ID
      , A.CLASS_TITLE
      , A.CLASS_NM
      , A.HOT_KEY
    FROM TB_HOT_KEY A
   WHERE 1=1
    AND A.HOT_KEY_TYPE = '01'
    AND A.CLASS_TITLE != ''`,

  SELECT_BF_HOT_KEY:
  `SELECT A.HOT_KEY_TYPE
      , A.CLASS_ID
      , A.CLASS_TITLE
      , A.CLASS_NM
      , A.HOT_KEY
    FROM TB_HOT_KEY A
   WHERE 1=1
    AND A.HOT_KEY_TYPE = '02'
    AND A.CLASS_TITLE != ''`,

  INSERT_BACKUP_HIST:
  `INSERT INTO TB_BACKUP_HIST
    (CASSET_ID
      , SLOT_ID
      , IS_BACKUP
      , BACKUP_DTTM
      , RESTORE_DTTM
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID)
   VALUES(?,?,?,?,?,?,?,?,?)`,

  UPDATE_WBC_CUSTOM_CLASS:
  `UPDATE TB_WBC_CUSTOM_CLASS
    SET CLASS_TITLE = ?
      , CLASS_NM = ?
   WHERE CLASS_ID = ?`,

   SEARCH_TEST_HISTORY_LIST:
   `SELECT SA.*
     FROM (
       SELECT
         TA.CASSET_ID
         , TA.SLOT_ID
         , TA.SLOT_NO
         , TA.BARCODE_NO
         , TA.PATIENT_ID
         , TA.PATIENT_NM
         , TA.ORDER_DTTM
         , TA.MALARIA_COUNT
         , TA.PLT_COUNT
         , TA.ANALYZE_DTTM
         , TA.BIRTHDAY
         , (CASE WHEN (TA.GENDER = '01') THEN 'Male'
             ELSE 'Female'
            END) AS GENDER
         , TA.GENDER AS GENDER_CD
         , (CASE WHEN (TA.TEST_TYPE = '01' OR TA.TEST_TYPE = '04') THEN 'PB'
                  ELSE 'BF'
            END) AS TEST_TYPE
         , TA.TEST_TYPE AS TEST_TYPE_CD
         , TA.SIGNED_STATE
         , TA.SIGNED_DTTM
         , TA.SIGNED_USER_ID
         , TA.WBC_COMMENT
         , TA.RBC_COMMENT
         , TA.MAX_WBC_COUNT
         , TA.MAX_RBC_COUNT
         , TA.SERIAL_NO
         , TA.TACT_TIME
         , TA.IS_NS_NB_INTEGRATION
         , TA.IS_NORMAL
         , TA.IS_CHECKED
         , TB.USER_ID
         , TB.MACHINE_ID
         , TB.HOST_IP
         , TB.LOCAL_IP
         , IFNULL(TB.LOCK_STATE, 'N') AS LOCK_STATE
         , TB.LOCK_DTTM
         , ROW_NUMBER() OVER(ORDER BY TA.ANALYZE_DTTM DESC) AS ROW_NUM
         , (SELECT JSON_ARRAYAGG(
                   JSON_OBJECT('id', B.CLASS_ID, 'title', B.CLASS_TITLE, 'name', B.CLASS_NM, 'count', B.COUNT)
           ) FROM TB_WBC_CLASSIFICATION B
            WHERE TA.CASSET_ID = B.CASSET_ID
            AND TA.SLOT_ID = B.SLOT_ID) WBC_INFO
         , (SELECT IFNULL(MIN(B.COUNT), 0)
            FROM TB_WBC_CLASSIFICATION B
           WHERE TA.CASSET_ID = B.CASSET_ID
                AND TA.SLOT_ID = B.SLOT_ID
               AND B.CLASS_TITLE = 'NR') AS NR_COUNT
         , (SELECT IFNULL(SUM(B.COUNT), 0)
             FROM TB_WBC_CLASSIFICATION B
            WHERE TA.CASSET_ID = B.CASSET_ID
                AND TA.SLOT_ID = B.SLOT_ID
                   AND B.CLASS_TITLE <> 'NR'
                   AND B.CLASS_TITLE <> 'GP'
                   AND B.CLASS_TITLE <> 'PA'
                   AND B.CLASS_TITLE <> 'AR'
                   AND B.CLASS_TITLE <> 'MA'
                   AND B.CLASS_TITLE <> 'MC') AS WBC_TOTAL
         FROM TB_TEST_HISTORY TA
           LEFT JOIN TB_VIEWER_LOCK_INFO TB
                   ON TA.CASSET_ID = TB.CASSET_ID
                   AND TA.SLOT_ID = TB.SLOT_ID
         WHERE 1=1
          AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')
          LIMIT ?, ?
       )SA
    WHERE 1=1`,

   SEARCH_TEST_HISTORY_LIST_ALL:
   `SELECT TA.*
    FROM (
    SELECT SA.CASSET_ID
    	, SA.SLOT_ID
    	, SA.SLOT_NO
    	, SA.BARCODE_NO
    	, SA.PATIENT_ID
    	, SA.PATIENT_NM
    	, SA.ORDER_DTTM
    	, SA.MALARIA_COUNT
    	, SA.PLT_COUNT
    	, SA.ANALYZE_DTTM
    	, SA.BIRTHDAY
    	, (CASE WHEN (SA.GENDER = '01') THEN 'Male'
    		 ELSE 'Female'
    		END) AS GENDER
    	, SA.GENDER AS GENDER_CD
    	, (CASE WHEN (SA.TEST_TYPE = '01' OR SA.TEST_TYPE = '04') THEN 'PB'
    		 ELSE 'BF'
    		END) AS TEST_TYPE
    	, SA.TEST_TYPE AS TEST_TYPE_CD
    	, SA.SIGNED_STATE
    	, SA.SIGNED_DTTM
    	, SA.SIGNED_USER_ID
    	, SA.WBC_COMMENT
    	, SA.RBC_COMMENT
    	, SA.MAX_WBC_COUNT
    	, SA.MAX_RBC_COUNT
    	, SA.SERIAL_NO
    	, SA.TACT_TIME
    	, SA.IS_NS_NB_INTEGRATION
    	, SA.NR_COUNT
    	, SA.WBC_TOTAL
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'NE' THEN SA.AFTER_COUNT END), '0') 	AS A_Neutrophil
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'NS' THEN SA.AFTER_COUNT END), '0') 	AS A_NeutrophilS
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'NB' THEN SA.AFTER_COUNT END), '0') 	AS A_NeutrophilB
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'ME' THEN SA.AFTER_COUNT END), '0') 	AS A_Metamyelocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'MY' THEN SA.AFTER_COUNT END), '0') 	AS A_Myelocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'PR' THEN SA.AFTER_COUNT END), '0') 	AS A_Promyelocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'LY' THEN SA.AFTER_COUNT END), '0') 	AS A_Lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'LR' THEN SA.AFTER_COUNT END), '0') 	AS A_Reactive_lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'LA' THEN SA.AFTER_COUNT END), '0') 	AS A_Abnormal_lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'MO' THEN SA.AFTER_COUNT END), '0') 	AS A_Monocyte
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'EO' THEN SA.AFTER_COUNT END), '0') 	AS A_Eosinophil
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'BA' THEN SA.AFTER_COUNT END), '0') 	AS A_Basophil
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'BL' THEN SA.AFTER_COUNT END), '0') 	AS A_Blast
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'PC' THEN SA.AFTER_COUNT END), '0') 	AS A_Plasma_cell
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'NR' THEN SA.AFTER_COUNT END), '0') 	AS A_nRBC
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'GP' THEN SA.AFTER_COUNT END), '0') 	AS A_Giant_platelet
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'PA' THEN SA.AFTER_COUNT END), '0') 	AS A_Platelet_aggregation
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'MA' THEN SA.AFTER_COUNT END), '0') 	AS A_Malaria
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_TITLE = 'AR' THEN SA.AFTER_COUNT END), '0') 	AS A_Artifact
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '90' THEN SA.AFTER_COUNT END), '0') 		AS A_CUSTOM_90_CNT
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '90' THEN SA.AFTER_CLASS_NM END), '0') 	AS A_CUSTOM_90_NM
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '91' THEN SA.AFTER_COUNT END), '0') 		AS A_CUSTOM_91_CNT
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '91' THEN SA.AFTER_CLASS_NM END), '0') 	AS A_CUSTOM_91_NM
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '92' THEN SA.AFTER_COUNT END), '0') 		AS A_CUSTOM_92_CNT
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '92' THEN SA.AFTER_CLASS_NM END), '0') 	AS A_CUSTOM_92_NM
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '93' THEN SA.AFTER_COUNT END), '0') 		AS A_CUSTOM_93_CNT
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '93' THEN SA.AFTER_CLASS_NM END), '0') 	AS A_CUSTOM_93_NM
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '94' THEN SA.AFTER_COUNT END), '0') 		AS A_CUSTOM_94_CNT
    	, IFNULL(MAX(CASE WHEN SA.AFTER_CLASS_ID = '94' THEN SA.AFTER_CLASS_NM END), '0') 	AS A_CUSTOM_94_NM
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'NE' THEN SA.BEFORE_COUNT END), '0') AS B_Neutrophil
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'NS' THEN SA.BEFORE_COUNT END), '0') AS B_NeutrophilS
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'NB' THEN SA.BEFORE_COUNT END), '0') AS B_NeutrophilB
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'ME' THEN SA.BEFORE_COUNT END), '0') AS B_Metamyelocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'MY' THEN SA.BEFORE_COUNT END), '0') AS B_Myelocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'PR' THEN SA.BEFORE_COUNT END), '0') AS B_Promyelocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'LY' THEN SA.BEFORE_COUNT END), '0') AS B_Lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'LR' THEN SA.BEFORE_COUNT END), '0') AS B_Reactive_lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'LA' THEN SA.BEFORE_COUNT END), '0') AS B_Abnormal_lymphocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'MO' THEN SA.BEFORE_COUNT END), '0') AS B_Monocyte
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'EO' THEN SA.BEFORE_COUNT END), '0') AS B_Eosinophil
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'BA' THEN SA.BEFORE_COUNT END), '0') AS B_Basophil
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'BL' THEN SA.BEFORE_COUNT END), '0') AS B_Blast
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'PC' THEN SA.BEFORE_COUNT END), '0') AS B_Plasma_cell
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'NR' THEN SA.BEFORE_COUNT END), '0') AS B_nRBC
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'GP' THEN SA.BEFORE_COUNT END), '0') AS B_Giant_platelet
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'PA' THEN SA.BEFORE_COUNT END), '0') AS B_Platelet_aggregation
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'MA' THEN SA.BEFORE_COUNT END), '0') AS B_Malaria
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_TITLE = 'AR' THEN SA.BEFORE_COUNT END), '0') AS B_Artifact
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '90' THEN SA.BEFORE_COUNT END), '0') 		AS B_CUSTOM_90_CNT
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '90' THEN SA.BEFORE_CLASS_NM END), '0') 	AS B_CUSTOM_90_NM
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '91' THEN SA.BEFORE_COUNT END), '0') 		AS B_CUSTOM_91_CNT
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '91' THEN SA.BEFORE_CLASS_NM END), '0') 	AS B_CUSTOM_91_NM
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '92' THEN SA.BEFORE_COUNT END), '0') 		AS B_CUSTOM_92_CNT
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '92' THEN SA.BEFORE_CLASS_NM END), '0') 	AS B_CUSTOM_92_NM
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '93' THEN SA.BEFORE_COUNT END), '0') 		AS B_CUSTOM_93_CNT
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '93' THEN SA.BEFORE_CLASS_NM END), '0') 	AS B_CUSTOM_93_NM
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '94' THEN SA.BEFORE_COUNT END), '0') 		AS B_CUSTOM_94_CNT
    	, IFNULL(MAX(CASE WHEN SA.BEFORE_CLASS_ID = '94' THEN SA.BEFORE_CLASS_NM END), '0') 	AS B_CUSTOM_94_NM
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '01' AND SA.RBC_CLASS_ID = '01' THEN SA.RBC_DEGREE END), '0') 	AS Size_Normal
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '01' AND SA.RBC_CLASS_ID = '02' THEN SA.RBC_DEGREE END), '0') 	AS Size_Macrocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '01' AND SA.RBC_CLASS_ID = '03' THEN SA.RBC_DEGREE END), '0') 	AS Size_Microcyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '01' AND SA.RBC_CLASS_ID = '04' THEN SA.RBC_DEGREE END), '0') 	AS Size_Anisocytosis
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '02' AND SA.RBC_CLASS_ID = '01' THEN SA.RBC_DEGREE END), '0') 	AS Chromia_Normal
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '02' AND SA.RBC_CLASS_ID = '02' THEN SA.RBC_DEGREE END), '0') 	AS Chromia_Hyperchromic
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '02' AND SA.RBC_CLASS_ID = '03' THEN SA.RBC_DEGREE END), '0') 	AS Chromia_Hypochromic
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '02' AND SA.RBC_CLASS_ID = '04' THEN SA.RBC_DEGREE END), '0') 	AS Chromia_Polychromia
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '01' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Normal
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '02' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Poikilocytosis
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '03' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Target_Cell
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '04' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Burr_Cell
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '05' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Acanthocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '06' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Ovalocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '07' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Schistocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '08' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Sickle_Cell
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '09' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Stomatocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '10' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Tear_Drop_cell
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '03' AND SA.RBC_CLASS_ID = '11' THEN SA.RBC_DEGREE END), '0') 	AS Shape_Spherocyte
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '05' AND SA.RBC_CLASS_ID = '01' THEN SA.RBC_DEGREE END), '0') 	AS Howell_Jolly_Body
    	, IFNULL(MAX(CASE WHEN SA.RBC_CATEGORY_ID = '05' AND SA.RBC_CLASS_ID = '02' THEN SA.RBC_DEGREE END), '0') 	AS Basophilic_Stippling
    FROM (SELECT A.CASSET_ID
    			, A.SLOT_ID
    			, A.SLOT_NO
    			, A.BARCODE_NO
    			, A.PATIENT_ID
    			, A.PATIENT_NM
    			, A.ORDER_DTTM
    			, A.MALARIA_COUNT
    			, A.PLT_COUNT
    			, A.BIRTHDAY
    			, A.GENDER
    			, A.TEST_TYPE
    			, A.SIGNED_STATE
    			, A.SIGNED_DTTM
    			, A.SIGNED_USER_ID
    			, A.WBC_COMMENT
    			, A.RBC_COMMENT
    			, A.MAX_WBC_COUNT
    			, A.MAX_RBC_COUNT
    			, (SELECT B.COUNT
    				FROM TB_WBC_CLASSIFICATION B
    				WHERE A.CASSET_ID = B.CASSET_ID
    					AND A.SLOT_ID = B.SLOT_ID
    					AND B.CLASS_TITLE = 'NR') 			AS NR_COUNT
    			, (SELECT SUM(B.COUNT)
    				FROM TB_WBC_CLASSIFICATION B
    				WHERE A.CASSET_ID = B.CASSET_ID
    					AND A.SLOT_ID = B.SLOT_ID
    					AND B.CLASS_TITLE <> 'NR'
    					AND B.CLASS_TITLE <> 'GP'
    					AND B.CLASS_TITLE <> 'PA'
    					AND B.CLASS_TITLE <> 'AR'
    					AND B.CLASS_TITLE <> 'MA'
    					AND B.CLASS_TITLE <> 'MC')		   AS WBC_TOTAL
    			, A.SERIAL_NO
    			, B.CLASS_ID				  					AS AFTER_CLASS_ID
    			, B.CLASS_NM				  					AS AFTER_CLASS_NM
    			, B.CLASS_TITLE								AS AFTER_CLASS_TITLE
    			, B.COUNT					   				AS AFTER_COUNT
    			, C.CLASS_ID				  					AS BEFORE_CLASS_ID
    			, C.CLASS_NM				  					AS BEFORE_CLASS_NM
    			, C.CLASS_TITLE								AS BEFORE_CLASS_TITLE
    			, C.COUNT					   				AS BEFORE_COUNT
    			, A.ANALYZE_DTTM           				AS ANALYZE_DTTM
    			, A.TACT_TIME              				AS TACT_TIME
    			, A.IS_NS_NB_INTEGRATION   				AS IS_NS_NB_INTEGRATION
    			, D.CATEGORY_ID								AS RBC_CATEGORY_ID
    			, D.CLASS_ID				   				AS RBC_CLASS_ID
    			, D.DEGREE					   				AS RBC_DEGREE
    			, A.IS_NORMAL              				AS IS_NORMAL
    			, A.IS_CHECKED             				AS IS_CHECKED
    		 FROM TB_TEST_HISTORY A
    			, TB_WBC_CLASSIFICATION B
    			, TB_WBC_CLASSIFICATION_HIST C
    			, TB_RBC_CLASSIFICATION D
    		WHERE 1=1
    			AND A.CASSET_ID = B.CASSET_ID
    			AND A.SLOT_ID = B.SLOT_ID
    			AND A.CASSET_ID = C.CASSET_ID
    			AND A.SLOT_ID = C.SLOT_ID
    			AND B.CLASS_ID = C.CLASS_ID
    			AND A.CASSET_ID = D.CASSET_ID
    			AND A.SLOT_ID = D.SLOT_ID
    		GROUP BY A.SLOT_ID, B.CLASS_ID, C.CLASS_ID, D.CATEGORY_ID, D.CLASS_ID
    		LIMIT ?, 500) SA
    GROUP BY SA.SLOT_ID) TA
    WHERE 1=1`,

  CHECK_SLIDE_LOCK_STATE:
  `SELECT CASSET_ID
      , SLOT_ID
      , USER_ID
      , MACHINE_ID
      , HOST_IP
      , LOCAL_IP
      , LOCK_DTTM
      , IFNULL(MIN(LOCK_STATE), 'N') AS LOCK_STATE
    FROM TB_VIEWER_LOCK_INFO
   WHERE CASSET_ID = ?
    AND SLOT_ID = ?`,

  UPDATE_SLIDE_LOCK_STATE:
  `UPDATE TB_VIEWER_LOCK_INFO
     SET IS_CHECKED = ?
   WHERE CASSET_ID = ?
     AND SLOT_ID = ?`,

  SELECT_WBC_MODIFY_LIST:
  `SELECT
    	A.CASSET_ID
    	, A.SLOT_ID
    	, A.CLASS_ID
    	, A.CLASS_TITLE
    	, A.CLASS_NM
    	, A.COUNT
    	, B.CURRENT_CLASS_ID
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '01' THEN 1 END) AS '01'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '71' THEN 1 END) AS '71'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '72' THEN 1 END) AS '72'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '02' THEN 1 END) AS '02'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '03' THEN 1 END) AS '03'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '04' THEN 1 END) AS '04'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '05' THEN 1 END) AS '05'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '61' THEN 1 END) AS '61'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '62' THEN 1 END) AS '62'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '07' THEN 1 END) AS '07'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '08' THEN 1 END) AS '08'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '09' THEN 1 END) AS '09'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '10' THEN 1 END) AS '10'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '11' THEN 1 END) AS '11'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '12' THEN 1 END) AS '12'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '13' THEN 1 END) AS '13'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '14' THEN 1 END) AS '14'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '15' THEN 1 END) AS '15'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '16' THEN 1 END) AS '16'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '90' THEN 1 END) AS '90'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '91' THEN 1 END) AS '91'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '92' THEN 1 END) AS '92'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '93' THEN 1 END) AS '93'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '94' THEN 1 END) AS '94'
   FROM TB_WBC_CLASSIFICATION A
  	  , TB_WBC_IMAGE_HIST B
  WHERE 1=1
    AND A.SLOT_ID = ?
  	AND A.CASSET_ID = B.CASSET_ID
  	AND A.SLOT_ID = B.SLOT_ID
  	AND A.CLASS_ID = B.CLASS_ID
  GROUP BY A.CLASS_ID
  ORDER BY A.CLASS_ID ASC`,

  SELECT_WBC_MODIFY_LIST_ALL:
  `SELECT
    	TA.CASSET_ID
    	, TA.SLOT_ID
      , TA.BARCODE_NO
	    , TA.IS_NS_NB_INTEGRATION
    	, (SELECT JSON_ARRAYAGG(
    				JSON_OBJECT('before', TA.CLASS_ID, 'after', TA.CURRENT_CLASS_ID,
    					'01', TA.NE, '02', TA.ME, '03', TA.MY, '04', TA.PR, '05', TA.LY, '07', TA.MO, '08', TA.EO,
    					'09', TA.BA, '10', TA.BL, '11', TA.PC, '12', TA.NR, '13', TA.GP, '14', TA.PA, '15', TA.AR,
    					'16', TA.MA, '71', TA.NS, '72', TA.NB, '61', TA.LR, '62', TA.LA, '90', TA.C90, '91', TA.C92,
    					'92', TA.C92, '93', TA.C93, '94', TA.C94)
    			  )
    	   ) AS Results
    FROM (
    	SELECT
    	   A.CASSET_ID
    	   , A.SLOT_ID
    	   , A.CLASS_ID
    	   , A.CLASS_NM
    	   , A.CLASS_TITLE
    	   , A.COUNT
    	   , B.CURRENT_CLASS_ID
         , C.BARCODE_NO
	       , C.IS_NS_NB_INTEGRATION
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '01' THEN 1 END) AS 'NE'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '71' THEN 1 END) AS 'NS'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '72' THEN 1 END) AS 'NB'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '02' THEN 1 END) AS 'ME'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '03' THEN 1 END) AS 'MY'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '04' THEN 1 END) AS 'PR'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '05' THEN 1 END) AS 'LY'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '61' THEN 1 END) AS 'LR'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '62' THEN 1 END) AS 'LA'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '07' THEN 1 END) AS 'MO'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '08' THEN 1 END) AS 'EO'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '09' THEN 1 END) AS 'BA'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '10' THEN 1 END) AS 'BL'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '11' THEN 1 END) AS 'PC'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '12' THEN 1 END) AS 'NR'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '13' THEN 1 END) AS 'GP'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '14' THEN 1 END) AS 'PA'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '15' THEN 1 END) AS 'AR'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '16' THEN 1 END) AS 'MA'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '90' THEN 1 END) AS 'C90'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '91' THEN 1 END) AS 'C91'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '92' THEN 1 END) AS 'C92'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '93' THEN 1 END) AS 'C93'
    	   , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '94' THEN 1 END) AS 'C94'
    	 FROM TB_WBC_CLASSIFICATION A
    	   , TB_WBC_IMAGE_HIST B
         , TB_TEST_HISTORY C
    	 WHERE 1=1
    	   AND A.SLOT_ID IN (?)
    	   AND A.CASSET_ID = B.CASSET_ID
    	   AND A.SLOT_ID = B.SLOT_ID
    	   AND A.CLASS_ID = B.CLASS_ID
         AND A.CASSET_ID = C.CASSET_ID
	       AND A.SLOT_ID = C.SLOT_ID
    	 GROUP BY A.CASSET_ID, A.SLOT_ID, B.CLASS_ID
    	 ORDER BY A.SLOT_ID ASC) TA
    WHERE 1=1
    GROUP BY TA.CASSET_ID, TA.SLOT_ID`,

  UPDATE_IS_CHECKED_CELL:
  `UPDATE TB_TEST_HISTORY
     SET IS_CHECKED = ?
   WHERE SLOT_ID = ?`,

  DELETE_TEST_HISTORY:
  `DELETE FROM TB_TEST_HISTORY
    WHERE SLOT_ID IN (SELECT SLOT_ID
                       FROM TB_TEST_HISTORY
                      WHERE SLOT_ID IN (userInput))`,

  SELECT_TEST_HISTORY:
  `SELECT CASSET_ID
      , SLOT_ID
      , SLOT_NO
      , BARCODE_NO
      , PATIENT_ID
      , PATIENT_NM
      , ORDER_DTTM
      , STATE_CD
      , MALARIA_COUNT
      , PLT_COUNT
      , ANALYZE_DTTM
      , BIRTHDAY
      , GENDER
      , GENDER    AS GENDER_CD
      , TEST_TYPE
      , TEST_TYPE AS TEST_TYPE_CD
      , SIGNED_STATE
      , SIGNED_DTTM
      , SIGNED_USER_ID
      , WBC_COMMENT
      , RBC_COMMENT
      , MAX_WBC_COUNT
      , MAX_RBC_COUNT
      , SERIAL_NO
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
      , TACT_TIME
      , IS_NS_NB_INTEGRATION
      , IS_NORMAL
      , IS_CHECKED
     FROM TB_TEST_HISTORY
    WHERE SLOT_ID = ?
    ORDER BY ANALYZE_DTTM DESC`,

  SELECT_EMP_NO:
  `SELECT EMP_NO
    FROM TB_USER
   WHERE 1=1
	  AND USER_ID = ?`,

  SELECT_WBC_CLASSIFICATION_HIST:
  `SELECT
     A.CASSET_ID
     , A.SLOT_ID
     , A.CLASS_ID
     , A.CLASS_NM
     , A.CLASS_TITLE
     , A.COUNT
     , IFNULL(B.ORDER_NO, '99') AS ORDER_NO
   FROM TB_WBC_CLASSIFICATION_HIST A
      LEFT JOIN TB_WBC_CLASS_ORDER B
       ON A.CLASS_ID = B.CLASS_ID
   WHERE A.CASSET_ID = ?
    AND A.SLOT_ID = ?
    AND B.TEST_TYPE = ?`,

  UPDATE_SIGNED_STATE:
  `UPDATE TB_TEST_HISTORY
    SET SIGNED_STATE = ?
      , SIGNED_DTTM = ?
      , SIGNED_USER_ID = ?
      , MODIFY_DTTM = ?
      , MODIFY_ID = ?
    WHERE SLOT_ID = ?`,

  INSERT_VIEWER_LOCK:
  `INSERT INTO TB_VIEWER_LOCK_INFO
   (
     CASSET_ID
     , SLOT_ID
     , USER_ID
     , MACHINE_ID
     , HOST_IP
     , LOCAL_IP
     , LOCK_STATE
     , LOCK_DTTM
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
   )
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
    LOCK_STATE = ?
    , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
    , MODIFY_ID = ?`,

  UPDATE_IS_NORMAL_CELL:
  `UPDATE TB_TEST_HISTORY
    SET IS_NORMAL = ?
   WHERE SLOT_ID = ?`,

  UPDATE_HOT_KEYS:
  `UPDATE TB_HOT_KEY
    SET HOT_KEY = ?
   WHERE HOT_KEY_TYPE = ?
    AND CLASS_ID = ?`,

  UPDATE_HOT_KEY_CLASS:
  `UPDATE TB_HOT_KEY
    SET CLASS_TITLE = ?
      , CLASS_NM = ?
   WHERE HOT_KEY_TYPE = ?
     AND CLASS_ID = ?`,

  SELECT_BF_WHOLE_SLIDE_PATH:
  `SELECT CASSET_ID
      , SLOT_ID
      , SEQ_NO
      , PATH
      , IS_HIGH_POWER_SCAN
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    FROM TB_BF_WHOLE_SLIDE_PATH
   WHERE SLOT_ID = ?`,

  SELECT_WBC_BF_MODIFY_LIST:
  `SELECT
     	A.CASSET_ID
     	, A.SLOT_ID
     	, A.CLASS_ID
     	, A.CLASS_TITLE
     	, A.CLASS_NM
     	, A.COUNT
     	, B.CURRENT_CLASS_ID
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '01' THEN 1 END) AS '01'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '02' THEN 1 END) AS '02'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '03' THEN 1 END) AS '03'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '04' THEN 1 END) AS '04'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '05' THEN 1 END) AS '05'
      , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '06' THEN 1 END) AS '06'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '07' THEN 1 END) AS '07'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '08' THEN 1 END) AS '08'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '09' THEN 1 END) AS '09'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '10' THEN 1 END) AS '10'
     	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '11' THEN 1 END) AS '11'
   FROM TB_WBC_CLASSIFICATION A
   	  , TB_WBC_IMAGE_HIST B
   WHERE 1=1
     AND A.SLOT_ID = ?
   	 AND A.CASSET_ID = B.CASSET_ID
   	 AND A.SLOT_ID = B.SLOT_ID
   	 AND A.CLASS_ID = B.CLASS_ID
   GROUP BY A.CLASS_ID
   ORDER BY A.CLASS_ID ASC`,

  SELECT_RBC_CLASSIFICATION_HIST:
  `SELECT
      TA.CASSET_ID
      , TA.SLOT_ID
      , TA.CATEGORY_ID
      , TA.CATEGORY_NM
      , TB.CLASS_ID
      , TB.CLASS_NM
      , TB.DEGREE
   FROM TB_RBC_CATEGORY TA
      , (SELECT *
          FROM TB_RBC_CLASSIFICATION_HIST
         WHERE SLOT_ID = ?
         ORDER BY CLASS_ID ASC
        ) TB
   WHERE TA.CASSET_ID = TB.CASSET_ID
    AND TA.SLOT_ID = TB.SLOT_ID
    AND TA.CATEGORY_ID = TB.CATEGORY_ID
    AND TA.SLOT_ID = ?
    ORDER BY TA.CATEGORY_ID ASC`,

  UPDATE_RBC_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET RBC_COMMENT = ?
   WHERE SLOT_ID = ?`,

  UPDATE_RBC_CLASSIFICATION:
  `UPDATE TB_RBC_CLASSIFICATION
    SET DEGREE = ?
   WHERE CASSET_ID = ?
     AND SLOT_ID = ?
     AND CATEGORY_ID = ?
     AND CLASS_ID = ?`,

  UPDATE_RBC_CLASSIFICATION_SKMC:
  `UPDATE TB_RBC_CLASSIFICATION
    SET DEGREE = ?
   WHERE CASSET_ID = ?
     AND SLOT_ID = ?
     AND CATEGORY_ID = ?
     AND CLASS_ID = ?`,

  SELECT_WBC_CLASSIFICATION:
  `SELECT A.CASSET_ID
			, A.SLOT_ID
			, A.CLASS_ID
			, A.CLASS_NM
			, A.CLASS_TITLE
			, A.COUNT
		 FROM TB_WBC_CLASSIFICATION A
		WHERE 1=1
			AND A.CASSET_ID = ?
			AND A.SLOT_ID = ?
      AND A.CLASS_ID IN (?, ?)`,

  SELECT_WBC_CLASSIFICATION_SLIDE:
  `SELECT A.CASSET_ID
			, A.SLOT_ID
			, A.CLASS_ID
			, A.CLASS_NM
			, A.CLASS_TITLE
			, A.COUNT
			, IFNULL(B.ORDER_NO, '99') AS ORDER_NO
		 FROM TB_WBC_CLASSIFICATION A
		 	LEFT JOIN TB_WBC_CLASS_ORDER B
	 		 ON A.CLASS_ID = B.CLASS_ID
		WHERE 1=1
			AND A.CASSET_ID = ?
			AND A.SLOT_ID = ?
      AND B.TEST_TYPE = ?`,

  SELECT_RBC_CLASSIFICATION_SLIDE:
  `SELECT A.CASSET_ID
			, A.SLOT_ID
			, A.CATEGORY_ID
			, A.CATEGORY_NM
			, B.CLASS_ID
			, B.CLASS_NM
			, B.DEGREE
		 FROM TB_RBC_CATEGORY A
			, TB_RBC_CLASSIFICATION B
		WHERE 1=1
			AND A.CASSET_ID = ?
			AND A.SLOT_ID = ?
			AND A.CASSET_ID = B.CASSET_ID
			AND A.SLOT_ID = B.SLOT_ID
			AND A.CATEGORY_ID = B.CATEGORY_ID`,

  UPDATE_CLASS_COUNT:
  `UPDATE TB_WBC_CLASSIFICATION
		 SET COUNT = ?
	 WHERE CASSET_ID = ?
		 AND SLOT_ID = ?
		 AND CLASS_ID = ?`,

  IS_WBC_CLASSIFICATION:
  `SELECT (CASE WHEN COUNT(*) = 0 THEN 'N'
				 ELSE 'Y'
				END) AS IS_INSERT
		FROM TB_WBC_CLASSIFICATION
		WHERE SLOT_ID = ?`,

  INSERT_WBC_CLASSIFICATION:
  `INSERT INTO TB_WBC_CLASSIFICATION
     VALUES (?,?,?,?,?,0, date_format(now(), '%Y%m%d%H%i%S'),?,date_format(now(), '%Y%m%d%H%i%S'), ?)`,

  INSERT_WBC_IMAGE_HIST:
  `INSERT INTO TB_WBC_IMAGE_HIST
      (CASSET_ID
      , SLOT_ID
      , CLASS_ID
      , FILE_NM
      , CURRENT_CLASS_ID
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID)
     VALUES (?,?,?,?,?,date_format(now(), '%Y%m%d%H%i%S'),?,date_format(now(), '%Y%m%d%H%i%S'),?)
   ON DUPLICATE KEY UPDATE
     CURRENT_CLASS_ID = ?
     , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
     , MODIFY_ID = ?`,

  UPDATE_WBC_IMAGE_HIST:
  `UPDATE TB_WBC_IMAGE_HIST
    SET CURRENT_CLASS_ID = ?
      , MODIFY_ID = ?
      , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
    WHERE CASSET_ID = ?
      AND SLOT_ID = ?
      AND FILE_NM = ?`,

  UPDATE_WBC_CLASSIFICATION:
  `UPDATE TB_WBC_CLASSIFICATION
			SET COUNT = CASE WHEN CLASS_ID = ? THEN COUNT - ?
							         WHEN CLASS_ID = ? THEN COUNT + ?
						      END
				, MODIFY_ID = ?
				, MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
		WHERE CASSET_ID = ?
			AND SLOT_ID = ?
			AND CLASS_ID IN (?, ?)`,

  INSERT_DEFAULT_CLASS_ORDER:
  `INSERT IGNORE INTO TB_WBC_CLASS_ORDER
    VALUES ('01', '01', '1', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('71', '01', '2', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('72', '01', '3', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '01', '4', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '01', '5', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('04', '01', '6', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('05', '01', '7', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('61', '01', '8', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('62', '01', '9', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('07', '01', '10', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('08', '01', '11', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('09', '01', '12', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('10', '01', '13', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('11', '01', '14', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('12', '01', '15', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('13', '01', '16', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('14', '01', '17', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('16', '01', '18', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('15', '01', '19', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('01', '02', '1', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('02', '02', '2', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('03', '02', '3', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('04', '02', '4', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('05', '02', '5', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('06', '02', '6', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('07', '02', '7', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('08', '02', '8', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('09', '02', '9', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('10', '02', '10', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')
      , ('11', '02', '11', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM', date_format(now(), '%Y%m%d%H%i%S'), 'SYSTEM')`,

  UPDATE_CLASS_ORDER:
  `UPDATE TB_WBC_CLASS_ORDER
    SET ORDER_NO = ?
      , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
      , MODIFY_ID = ?
   WHERE CLASS_ID = ?
     AND TEST_TYPE = ?`,

  UPDATE_WBC_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET WBC_COMMENT = ?
   WHERE SLOT_ID = ?`,

  UPDATE_RBC_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET RBC_COMMENT = ?
   WHERE SLOT_ID = ?`,

  SELECT_SKMC_RESULT_CD:
  `SELECT RESULT_CD
    , RESULT_CD_NM
    FROM TB_SKMC_RESULT_CD
   WHERE 1=1`,

  INSERT_SKMC_RESULT_CD:
  `INSERT INTO TB_SKMC_RESULT_CD
    (
      RESULT_CD
      , RESULT_CD_NM
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?)`,

  DELETE_SKMC_RESULT_CD:
  `DELETE
    FROM TB_SKMC_RESULT_CD
   WHERE RESULT_CD = ?`,

  SELECT_REMARK:
  `SELECT REMARK_CD
      , REMARK_CONTENTS
    FROM TB_SKMC_REMARK
   WHERE 1=1`,

  INSERT_REMARK:
  `INSERT INTO TB_SKMC_REMARK
    (
      REMARK_CD
      , REMARK_CONTENTS
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?)`,

  DELETE_REMARK:
  `DELETE
     FROM TB_SKMC_REMARK
   WHERE REMARK_CD = ?`,

  INSERT_SKMC_RESULT_FAVORITE_RBC:
  `INSERT INTO TB_SKMC_RESULT_FAVORITE_RBC
    (
      RESULT_CD
      , SIZE_CD
      , CHROMICITY_CD
      , ANISOCYTOSIS_CD
      , POIKILOCYTOSIS_CD
      , ELLIPTOCYTE_CD
      , BURRCELL_CD
      , TARGET_CELL_CD
      , SPHEROCYTE_CD
      , SCHISTOCYTE_CD
      , DIMORPHISM_CD
      , ROULEAUX_CD
      , POLYCHROMASIA_CD
      , BASO_CD
      , H_J_BODY_CD
      , NRBC_CD
      , OTHER_CD
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
    SIZE_CD = ?
    , CHROMICITY_CD = ?
    , ANISOCYTOSIS_CD = ?
    , POIKILOCYTOSIS_CD = ?
    , ELLIPTOCYTE_CD = ?
    , BURRCELL_CD = ?
    , TARGET_CELL_CD = ?
    , SPHEROCYTE_CD = ?
    , SCHISTOCYTE_CD = ?
    , DIMORPHISM_CD = ?
    , ROULEAUX_CD = ?
    , POLYCHROMASIA_CD = ?
    , BASO_CD = ?
    , H_J_BODY_CD = ?
    , NRBC_CD = ?
    , OTHER_CD = ?
    , MODIFY_DTTM = ?
    , MODIFY_ID = ?`,

  INSERT_SKMC_RESULT_FAVORITE_WBC:
  `INSERT INTO TB_SKMC_RESULT_FAVORITE_WBC
    (
      RESULT_CD
      , NUMBER_CD
      , TOXIC_GRANULE_CD
      , TOXIC_VACUOLE_CD
      , DOHLE_BODY_CD
      , L_S_MATURATION_CD
      , N_SEGMENTATION_CD
      , OTHER_CD
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
    NUMBER_CD = ?
    , TOXIC_GRANULE_CD = ?
    , TOXIC_VACUOLE_CD = ?
    , DOHLE_BODY_CD = ?
    , L_S_MATURATION_CD = ?
    , N_SEGMENTATION_CD = ?
    , OTHER_CD = ?
    , MODIFY_DTTM = ?
    , MODIFY_ID = ?`,

  INSERT_SKMC_RESULT_FAVORITE_PLT:
  `INSERT INTO TB_SKMC_RESULT_FAVORITE_PLT
    (
      RESULT_CD
      , NUMBER_CD
      , SIZE_CD
      , CLUMPING_CD
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
     NUMBER_CD = ?
     , SIZE_CD = ?
     , CLUMPING_CD = ?
     , MODIFY_DTTM = ?
     , MODIFY_ID = ?`,

  INSERT_SKMC_MAPPING_REMARK:
  `INSERT INTO TB_SKMC_MAPPING_REMARK
    (
      RESULT_CD
      , REMARK_CD
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?)`,

  DELETE_SKMC_FAVORITE_REMARK:
  `DELETE FROM TB_SKMC_FAVORITE_REMARK
   WHERE RESULT_CD = ?`,

  DELETE_SKMC_FAVORITE_WBC:
  `DELETE FROM TB_SKMC_RESULT_FAVORITE_WBC
   WHERE RESULT_CD = ?`,

  DELETE_SKMC_FAVORITE_RBC:
  `DELETE FROM TB_SKMC_RESULT_FAVORITE_RBC
   WHERE RESULT_CD = ?`,

  DELETE_SKMC_FAVORITE_PLT:
  `DELETE FROM TB_SKMC_RESULT_FAVORITE_PLT
   WHERE RESULT_CD = ?`,

  INSERT_SKMC_FAVORITE_REMARK:
  `INSERT INTO TB_SKMC_FAVORITE_REMARK
    (
      RESULT_CD
      , REMARK_CD
      , SEQ_NO
      , REMARK_CONTENTS
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?,?,?)
   ON DUPLICATE KEY UPDATE
     REMARK_CD = ?
     , SEQ_NO = ?
     , REMARK_CONTENTS = ?
     , MODIFY_DTTM = ?
     , MODIFY_ID = ?`,

  SELECT_SKMC_FAVORITE:
  `SELECT A.RESULT_CD
      , B.SIZE_CD              	AS RBC_SIZE_CD
      , B.CHROMICITY_CD        	AS RBC_CHROMICITY_CD
      , B.ANISOCYTOSIS_CD      	AS RBC_ANISOCYTOSIS_CD
      , B.POIKILOCYTOSIS_CD    	AS RBC_POIKILOCYTOSIS_CD
      , B.ELLIPTOCYTE_CD       	AS RBC_ELLIPTOCYTE_CD
      , B.BURRCELL_CD          	AS RBC_BURRCELL_CD
      , B.TARGET_CELL_CD       	AS RBC_TARGET_CELL_CD
      , B.SPHEROCYTE_CD        	AS RBC_SPHEROCYTE_CD
      , B.SCHISTOCYTE_CD       	AS RBC_SCHISTOCYTE_CD
      , B.DIMORPHISM_CD        	AS RBC_DIMORPHISM_CD
      , B.ROULEAUX_CD          	AS RBC_ROULEAUX_CD
      , B.POLYCHROMASIA_CD     	AS RBC_POLYCHROMASIA_CD
      , B.BASO_CD              	AS RBC_BASO_CD
      , B.H_J_BODY_CD          	AS RBC_H_J_BODY_CD
      , B.NRBC_CD              	AS RBC_NRBC_CD
      , B.OTHER_CD             	AS RBC_OTHER_CD
      , C.NUMBER_CD				      AS WBC_NUMBER_CD
      , C.TOXIC_GRANULE_CD		    AS WBC_TOXIC_GRANULE_CD
      , C.TOXIC_VACUOLE_CD		    AS WBC_TOXIC_VACUOLE_CD
      , C.DOHLE_BODY_CD			    AS WBC_DOHLE_BODY_CD
      , C.L_S_MATURATION_CD		  AS WBC_L_S_MATURATION_CD
      , C.N_SEGMENTATION_CD		  AS WBC_N_S_MATURATION_CD
      , C.OTHER_CD				        AS WBC_OTHER_CD
      , D.NUMBER_CD				      AS PLT_NUMBER_CD
      , D.SIZE_CD					      AS PLT_SIZE_CD
      , D.CLUMPING_CD				    AS PLT_CLUMPING_CD
      , (SELECT JSON_ARRAYAGG(
           JSON_OBJECT('remarkCd', A.REMARK_CD, 'text', A.REMARK_CONTENTS, 'seqNo', A.SEQ_NO))
             FROM TB_SKMC_FAVORITE_REMARK A
           WHERE A.RESULT_CD = ?) AS JSON_REMARKS
    FROM TB_SKMC_RESULT_CD A
      , TB_SKMC_RESULT_FAVORITE_RBC B
      , TB_SKMC_RESULT_FAVORITE_WBC C
      , TB_SKMC_RESULT_FAVORITE_PLT D
   WHERE A.RESULT_CD = ?
      AND A.RESULT_CD = B.RESULT_CD
      AND A.RESULT_CD = C.RESULT_CD
      AND A.RESULT_CD = D.RESULT_CD`,

  UPDATE_MALARIA_COUNT:
  `UPDATE TB_TEST_HISTORY
      SET MALARIA_COUNT = ?
      , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
      , MODIFY_ID = ?
  WHERE SLOT_ID = ?`,

  INSERT_IMAGE_ROLLBACK:
  `INSERT INTO TB_IMAGE_ROLLBACK
    (
      CASSET_ID
      , SLOT_ID
      , SRC_PATH
      , DEST_PATH
      , IS_ROLLBACK
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,date_format(now(), '%Y%m%d%H%i%S'),?,date_format(now(), '%Y%m%d%H%i%S'),?)`,

  UPDATE_IMAGE_ROLLBACK:
  `UPDATE TB_IMAGE_ROLLBACK
      SET IS_ROLLBACK = ?
      , MODIFY_DTTM = date_format(now(), '%Y%m%d%H%i%S')
      , MODIFY_ID = ?
   WHERE CASSET_ID = ?
     AND SLOT_ID = ?
     AND SRC_PATH = ?
     AND DEST_PATH = ?`,

  SELECT_IMAGE_ROLLBACK:
  `SELECT SEQ_NO
     , CASSET_ID
     , SLOT_ID
     , SRC_PATH
     , DEST_PATH
     , IS_ROLLBACK
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
   FROM TB_IMAGE_ROLLBACK
   WHERE 1=1
    AND CASSET_ID = ?
    AND SLOT_ID = ?
    AND IS_ROLLBACK = 'N'
    AND MODIFY_ID = ?
   ORDER BY SEQ_NO ASC`,

  DELETE_BACKUP_TEST_HISTORY:
  `DELETE
    FROM TB_TEST_HISTORY
   WHERE CASSET_ID = ?
    AND SLOT_ID = ?`

})
