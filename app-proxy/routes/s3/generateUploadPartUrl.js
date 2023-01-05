const aws = require('aws-sdk')
const { constants, baseS3InitConfig } = require('./s3GeneralConfig')

const s3 = new aws.S3(baseS3InitConfig)

async function generateUploadPartUrl (body) {
    const Key = body.fileName
    const UploadId = body.uploadId
    const PartNumber = body.partNumber

    const params = {
        Bucket: constants.bucket,
        Key,
        UploadId,
        PartNumber
    }

    const uploadPartUrl = await s3.getSignedUrl('uploadPart', params)
    return uploadPartUrl
}

module.exports = generateUploadPartUrl