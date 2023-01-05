const aws = require('aws-sdk')
const { constants, baseS3InitConfig } = require('./s3GeneralConfig')

const s3 = new aws.S3(baseS3InitConfig)

async function generateMultipartUploadId (fileName) {
    const params = {
        Bucket: constants.bucket,
        Key: fileName,
        Expires: Date.now() + constants.expires
    }

    const multipartUploadId = await s3.createMultipartUpload(params).promise()
    return multipartUploadId.UploadId
}

module.exports = generateMultipartUploadId