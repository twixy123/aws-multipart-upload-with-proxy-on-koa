const generateSimpleUploadUrl = require('./generateSimpleUploadUrl')
const generateMultipartUploadId = require('./generateMultipartUploadId')
const generateUploadPartUrl = require('./generateUploadPartUrl')
const completeUpload = require('./completeUpload')
const abortUpload = require('./abortUpload')

module.exports = {
    getSimpleUploadUrl: async (fileName) => {
        return await generateSimpleUploadUrl(fileName)
    },
    getMultipartUploadId: async (fileName) => {
        return await generateMultipartUploadId(fileName)
    },
    getUploadPartUrl: async (body) => {
        return await generateUploadPartUrl(body)
    },
    completeUpload: async (body) => {
        return await completeUpload(body)
    },
    abortUpload: async (body) => {
        return await abortUpload(body)
    }
}