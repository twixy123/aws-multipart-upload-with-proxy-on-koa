const Router = require('koa-router')
const router = new Router()

const s3Model = require('./s3')

router.get('/', async (ctx) => {
    try {
        ctx.body = 'Hello world'
    } catch (error) {
        ctx.status = 500
        ctx.body = { success: false }
    }
})

router.get('/bff/s3-bucket/get-simple-upload-url', async (ctx) => {
    try {
        const url = await s3Model.getSimpleUploadUrl(ctx.query.fileName)
        ctx.body = { url }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            success: false,
            message: 'Не удалось получить ссылку.',
            code: 1,
        }
    }
})

router.get('/bff/s3-bucket/get-multipart-upload-id', async (ctx) => {
    try {
        const uploadId = await s3Model.getMultipartUploadId(ctx.query.fileName)
        ctx.body = { uploadId }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            success: false,
            message: 'Не удалось получить ссылку.',
            code: 1,
        }
    }
})

router.post('/bff/s3-bucket/get-upload-part-url', async (ctx) => {
    try {
        const url = await s3Model.getUploadPartUrl(ctx.request.body)
        ctx.body = { url }
    } catch (error) {
        const partNumber = ctx.request.body?.partNumber || 0
        ctx.status = 500
        ctx.body = {
            success: false,
            message: `Не удалось получить ссылку для ${partNumber} части файла.`,
            code: 2
        }
    }
})

router.post('/bff/s3-bucket/complete-upload', async (ctx) => {
    try {
        const location = await s3Model.completeUpload(ctx.request.body)
        ctx.body = { location }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            success: false,
            message: `Не удалось загрузить файл в корзину.`,
            code: 3
        }
    }
})

router.post('/bff/s3-bucket/abort-upload', async (ctx) => {
    try {
        await s3Model.abortUpload(ctx.request.body)
        ctx.body = { success: true }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            success: false,
            message: `Не удалось отменить загрузку файла.`,
            code: 3
        }
    }
})





module.exports = router