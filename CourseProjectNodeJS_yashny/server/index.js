require('dotenv').config()
const express = require('express')
const https = require('https')
const fs = require('fs')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandling = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT
const SSL_KEY_PATH = '../private.key'
const SSL_CERT_PATH = '../certificate.crt'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))

app.use(errorHandling)

const options = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
}

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        https.createServer(options, app).listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e)
    }
}

start()