const aws = require('aws-sdk')
const { constants, baseS3InitConfig } = require('./s3GeneralConfig')

const s3 = new aws.S3(baseS3InitConfig)

async function generateSimpleUploadUrl (fileName) {
    const params = {
        Bucket: constants.bucket,
        Key: fileName,
        Expires: Date.now() + constants.expires
    }

    try {
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params)
        return uploadUrl
    } catch (error) {
        console.error('generateSimpleUploadUrl', error);
    }    
}

module.exports = generateSimpleUploadUrl