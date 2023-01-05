const aws = require('aws-sdk')
const { constants, baseS3InitConfig } = require('./s3GeneralConfig')

const s3 = new aws.S3(baseS3InitConfig)

async function completeUpload (body) {
    const Key = body.fileName
    const UploadId = body.uploadId

    const params = {
        Bucket: constants.bucket,
        Key,
        UploadId
    }

    const completeUpload = await s3.abortMultipartUpload(params).promise()
    return completeUpload
}

module.exports = completeUpload