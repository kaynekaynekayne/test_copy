export default Object.freeze({
  TABLES: [
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_TEST_HISTORY (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , SLOT_NO                   VARCHAR(100) NOT NULL
          , BARCODE_NO                VARCHAR(50)  NOT NULL
          , PATIENT_ID                VARCHAR(50)
          , PATIENT_NM                VARCHAR(200)
          , ORDER_DTTM                VARCHAR(50)
          , STATE_CD                  VARCHAR(10)
          , MALARIA_COUNT             SMALLINT
          , PLT_COUNT                 SMALLINT
          , ANALYZE_DTTM              VARCHAR(50)
          , BIRTHDAY                  VARCHAR(50)
          , GENDER                    VARCHAR(10)
          , TEST_TYPE                 VARCHAR(10)
          , SIGNED_STATE              VARCHAR(50)
          , SIGNED_DTTM               VARCHAR(50)
          , SIGNED_USER_ID            VARCHAR(50)
          , WBC_COMMENT               TEXT
          , RBC_COMMENT               TEXT
          , MAX_WBC_COUNT             SMALLINT
          , MAX_RBC_COUNT             SMALLINT
          , SERIAL_NO                 VARCHAR(50)  NOT NULL
          , TACT_TIME                 VARCHAR(10)
          , IS_NS_NB_INTEGRATION      VARCHAR(10)  NOT NULL
          , IS_NORMAL                 VARCHAR(10)  NOT NULL
          , IS_CHECKED                VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID)
        , KEY IDX_TEST_HISTORY(CASSET_ID, SLOT_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_CLASSIFICATION (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_NM                  VARCHAR(200) NOT NULL
          , CLASS_TITLE               VARCHAR(10)  NOT NULL
          , COUNT                     INT          NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, CLASS_ID)
        , KEY IDX_WBC_CLASSIFICATION(CASSET_ID, SLOT_ID, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_CLASSIFICATION_HIST (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_NM                  VARCHAR(200) NOT NULL
          , CLASS_TITLE               VARCHAR(10)  NOT NULL
          , COUNT                     INT          NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, CLASS_ID)
        , KEY IDX_WBC_CLASSIFICATION_HIST(CASSET_ID, SLOT_ID, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_RBC_CATEGORY (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , CATEGORY_ID               VARCHAR(10)  NOT NULL
          , CATEGORY_NM               VARCHAR(200)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID)
        , KEY IDX_RBC_CATEGORY(CASSET_ID, SLOT_ID, CATEGORY_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_RBC_CLASSIFICATION (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , CATEGORY_ID               VARCHAR(10)  NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_NM                  VARCHAR(200) NOT NULL
          , DEGREE                    VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
        , KEY IDX_RBC_CLASSIFICATION(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_RBC_CLASSIFICATION_HIST (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , CATEGORY_ID               VARCHAR(10)  NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_NM                  VARCHAR(200) NOT NULL
          , DEGREE                    VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
        , KEY IDX_RBC_CLASSIFICATION_HIST(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_BF_WHOLE_SLIDE_PATH (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , SEQ_NO                    VARCHAR(10)  NOT NULL
          , PATH                      VARCHAR(500) NOT NULL
          , IS_HIGH_POWER_SCAN        VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, SEQ_NO)
        , KEY IDX_BF_WHOLE_SLIDE_PATH(CASSET_ID, SLOT_ID, SEQ_NO)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_USER_AUTHORITY (
          AUTH_CD                     VARCHAR(10)  NOT NULL
          , AUTH_NM                   VARCHAR(255) NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(AUTH_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_USER (
          USER_ID                     VARCHAR(50)  NOT NULL
          , USER_NM                   VARCHAR(255) NOT NULL
          , EMP_NO                    VARCHAR(255) NOT NULL
          , POSITION                  VARCHAR(10)  NOT NULL
          , AUTH_CD                   VARCHAR(10)  NOT NULL
          , ENC_PWD                   TEXT         NOT NULL
          , IS_AVAILABLE              VARCHAR(10)  NOT NULL
          , LOGIN_DTTM                VARCHAR(50)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(USER_ID)
        , KEY IDX_USER(USER_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_IMAGE_HIST (
          CASSET_ID                   VARCHAR(100)  NOT NULL
          , SLOT_ID                   VARCHAR(100)  NOT NULL
          , FILE_NM                   VARCHAR(255)  NOT NULL
          , CLASS_ID                  VARCHAR(10)   NOT NULL
          , CURRENT_CLASS_ID          VARCHAR(10)   NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID, FILE_NM)
        , KEY IDX_WBC_IMAGE_HIST(CASSET_ID, SLOT_ID, FILE_NM)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_RBC_DEGREE_VAL (
          CATEGORY_ID                 VARCHAR(10)  NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , DEGREE_1                  FLOAT        NOT NULL
          , DEGREE_2                  FLOAT        NOT NULL
          , DEGREE_3                  FLOAT        NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CATEGORY_ID, CLASS_ID)
        , KEY IDX_RBC_DEGREE_VAL(CATEGORY_ID, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_HOT_KEY (
          HOT_KEY_TYPE                VARCHAR(10)  NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_TITLE               VARCHAR(10)
          , CLASS_NM                  VARCHAR(200)
          , HOT_KEY                   VARCHAR(10)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(HOT_KEY_TYPE, CLASS_ID)
        , KEY IDX_HOT_KEY(HOT_KEY_TYPE, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_COMMON_CODE_GRP (
          GRP_CD                      VARCHAR(10)  NOT NULL
          , GRP_NM                    VARCHAR(255)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(GRP_CD)
        , KEY IDX_COMMON_CODE_GRP(GRP_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_COMMON_CODE (
          GRP_CD                      VARCHAR(10)  NOT NULL
          , CD                        VARCHAR(10)  NOT NULL
          , CD_NM                     VARCHAR(255)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(GRP_CD, CD)
        , KEY IDX_COMMON_CODE(GRP_CD, CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_CUSTOM_CLASS (
          CLASS_ID                    VARCHAR(10)  NOT NULL
          , CLASS_TITLE               VARCHAR(10)
          , CLASS_NM                  VARCHAR(200)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CLASS_ID)
        , KEY IDX_WBC_CUSTOM_CLASS(CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_LIS_CONN_PATH (
          DEVICE_BARCODE              VARCHAR(50)  NOT NULL
          , LIS_FILE_PATH             TEXT
          , LIS_URL                   TEXT
          , LIS_CONN_TYPE_CD          VARCHAR(10)  NOT NULL
          , CBC_FILE_PATH             TEXT
          , CBC_URL                   TEXT
          , CBC_CONN_TYPE_CD          VARCHAR(50)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(DEVICE_BARCODE)
        , KEY IDX_LIS_CONN_PATH(DEVICE_BARCODE)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_LIS_TEST_CODE (
          IA_CD                       VARCHAR(50)  NOT NULL
          , LIS_CD                    VARCHAR(50)
          , CD_NM                     VARCHAR(200)
          , MIN_COUNT                 SMALLINT
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(IA_CD)
        , KEY IDX_LIS_TEST_CODE(IA_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_LIS_TEST_CODE_RBC (
          IA_CATEGORY_CD              VARCHAR(10)  NOT NULL
          , IA_CLASS_CD               VARCHAR(10)  NOT NULL
          , LIS_CD                    VARCHAR(50)
          , CATEGORY_NM               VARCHAR(200)
          , CLASS_NM                  VARCHAR(200)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(IA_CATEGORY_CD, IA_CLASS_CD)
        , KEY IDX_LIS_TEST_CODE_RBC(IA_CATEGORY_CD, IA_CLASS_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_CBC_TEST_CODE (
          IA_CD                       VARCHAR(10)  NOT NULL
          , CBC_CD                    VARCHAR(50)
          , CD_NM                     VARCHAR(200)
          , IS_SELECTED               VARCHAR(10)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(IA_CD)
        , KEY IDX_CBC_TEST_CODE(IA_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_BACKUP_HIST (
          BACKUP_SEQ_ID               INT         AUTO_INCREMENT
          , CASSET_ID                 VARCHAR(100)
          , SLOT_ID                   VARCHAR(100)
          , IS_BACKUP                 VARCHAR(10)
          , BACKUP_DTTM               VARCHAR(50)
          , RESTORE_DTTM              VARCHAR(50)
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(BACKUP_SEQ_ID)
        , KEY IDX_BACKUP_HIST(BACKUP_SEQ_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_VIEWER_LOCK_INFO (
          CASSET_ID                   VARCHAR(100) NOT NULL
          , SLOT_ID                   VARCHAR(100) NOT NULL
          , USER_ID                   VARCHAR(50)  NOT NULL
          , MACHINE_ID                VARCHAR(255) NOT NULL
          , HOST_IP                   VARCHAR(255)
          , LOCAL_IP                  VARCHAR(255)
          , LOCK_STATE                VARCHAR(10)  NOT NULL
          , LOCK_DTTM                 VARCHAR(50)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(CASSET_ID, SLOT_ID)
        , KEY IDX_VIEWER_LOCK_INFO(CASSET_ID, SLOT_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_NORMAL_RANGE (
          ANALYSIS_TYPE               VARCHAR(100) NOT NULL
          , CLASS_ID                  VARCHAR(10)  NOT NULL
          , CLASS_TITLE               VARCHAR(10)  NOT NULL
          , CLASS_NM                  VARCHAR(200) NOT NULL
          , MIN                       SMALLINT     NOT NULL
          , MAX                       SMALLINT     NOT NULL
          , UNIT                      VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(ANALYSIS_TYPE, CLASS_ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_RESULT_CD (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , RESULT_CD_NM              VARCHAR(255) NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_RESULT_FAVORITE_RBC (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , SIZE_CD                   VARCHAR(10)  NOT NULL
          , CHROMICITY_CD             VARCHAR(10)  NOT NULL
          , ANISOCYTOSIS_CD           VARCHAR(10)  NOT NULL
          , POIKILOCYTOSIS_CD         VARCHAR(10)  NOT NULL
          , ELLIPTOCYTE_CD            VARCHAR(10)  NOT NULL
          , BURRCELL_CD               VARCHAR(10)  NOT NULL
          , TARGET_CELL_CD            VARCHAR(10)  NOT NULL
          , SPHEROCYTE_CD             VARCHAR(10)  NOT NULL
          , SCHISTOCYTE_CD            VARCHAR(10)  NOT NULL
          , DIMORPHISM_CD             VARCHAR(10)  NOT NULL
          , ROULEAUX_CD               VARCHAR(10)  NOT NULL
          , POLYCHROMASIA_CD          VARCHAR(10)  NOT NULL
          , BASO_CD                   VARCHAR(10)  NOT NULL
          , H_J_BODY_CD               VARCHAR(10)  NOT NULL
          , NRBC_CD                   VARCHAR(10)  NOT NULL
          , OTHER_CD                  VARCHAR(255) NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_RESULT_FAVORITE_WBC (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , NUMBER_CD                 VARCHAR(10)  NOT NULL
          , TOXIC_GRANULE_CD          VARCHAR(10)  NOT NULL
          , TOXIC_VACUOLE_CD          VARCHAR(10)  NOT NULL
          , DOHLE_BODY_CD             VARCHAR(10)  NOT NULL
          , L_S_MATURATION_CD         VARCHAR(10)  NOT NULL
          , N_SEGMENTATION_CD         VARCHAR(10)  NOT NULL
          , OTHER_CD                  VARCHAR(255) NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_RESULT_FAVORITE_PLT (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , NUMBER_CD                 VARCHAR(10)  NOT NULL
          , SIZE_CD                   VARCHAR(10)  NOT NULL
          , CLUMPING_CD               VARCHAR(10)  NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_REMARK (
          REMARK_CD                   VARCHAR(50)  NOT NULL
          , REMARK_CONTENTS           TEXT         NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(REMARK_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_MAPPING_REMARK (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , REMARK_CD                 VARCHAR(255) NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD, REMARK_CD)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_FAVORITE_REMARK (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , REMARK_CD                 VARCHAR(255) NOT NULL
          , SEQ_NO                    VARCHAR(50)  NOT NULL
          , REMARK_CONTENTS           TEXT         NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD, REMARK_CD, SEQ_NO)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_SKMC_FAVORITE_REMARK (
          RESULT_CD                   VARCHAR(50)  NOT NULL
          , REMARK_CD                 VARCHAR(255) NOT NULL
          , SEQ_NO                    VARCHAR(50)  NOT NULL
          , REMARK_CONTENTS           TEXT         NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(RESULT_CD, REMARK_CD, SEQ_NO)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_RUNNING_COUNT (
          ID                          VARCHAR(10)  NOT NULL
          , MIN                       SMALLINT     NOT NULL
          , MAX                       SMALLINT     NOT NULL
          , COUNT                     SMALLINT     NOT NULL
          , CREATE_DTTM               VARCHAR(50)  NOT NULL
          , CREATE_ID                 VARCHAR(50)  NOT NULL
          , MODIFY_DTTM               VARCHAR(50)  NOT NULL
          , MODIFY_ID                 VARCHAR(50)  NOT NULL
        , PRIMARY KEY(ID)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_WBC_CLASS_ORDER (
        CLASS_ID                      VARCHAR(10)  NOT NULL
        , TEST_TYPE                   VARCHAR(10)  NOT NULL
        , ORDER_NO                    VARCHAR(50)
        , CREATE_DTTM                 VARCHAR(50)
        , CREATE_ID                   VARCHAR(50)
        , MODIFY_DTTM                 VARCHAR(50)
        , MODIFY_ID                   VARCHAR(50)
        , PRIMARY KEY(CLASS_ID, TEST_TYPE)
      )`
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS PB_DB.TB_IMAGE_ROLLBACK (
        SEQ_NO                         INT(10)       NOT NULL AUTO_INCREMENT
        , CASSET_ID                    VARCHAR(100)  NOT NULL
        , SLOT_ID                      VARCHAR(100)  NOT NULL
        , SRC_PATH                     TEXT          NOT NULL
        , DEST_PATH                    TEXT          NOT NULL
        , IS_ROLLBACK                  VARCHAR(1)    NOT NULL
        , CREATE_DTTM                  VARCHAR(50)
        , CREATE_ID                    VARCHAR(50)
        , MODIFY_DTTM                  VARCHAR(50)
        , MODIFY_ID                    VARCHAR(50)
        , PRIMARY KEY(SEQ_NO)
      )`
    }
  ]
})
