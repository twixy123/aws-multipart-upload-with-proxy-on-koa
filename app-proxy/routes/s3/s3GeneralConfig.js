const appConstants = require('../../constants')

const constants = {
    region: appConstants.BUCKET_REGION,
    bucket: appConstants.BUCKET_NAME,
    accessKeyId: appConstants.ACCESS_KEY_ID,
    secretAccessKey: appConstants.SECRET_ACCESS_KEY,
    expires: 20 * 60 * 1000, //20 mins
}

const baseS3InitConfig = {
    region: constants.region,
    accessKeyId: constants.accessKeyId,
    secretAccessKey: constants.secretAccessKey,
    signatureVersion: 'v4'
}

module.exports = {
    constants,
    baseS3InitConfig
}