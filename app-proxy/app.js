const Koa = require('koa')
const cors = require('@koa/cors');
const koaBody = require('koa-body')
const router = require('./routes')
const { PORT } = require('./constants')

const app = new Koa()

app.use(cors())
app.use(koaBody())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})