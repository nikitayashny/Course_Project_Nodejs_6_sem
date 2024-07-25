require('dotenv').config()
const express = require('express')
//const https = require('https')
const http = require('http')
const fs = require('fs')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandling = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
//const WebSocket = require('ws');
//const { v4: uuidv4 } = require('uuid')

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

// const options = {
//     key: fs.readFileSync(SSL_KEY_PATH),
//     cert: fs.readFileSync(SSL_CERT_PATH)
// }

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        // const server = http.createServer(app).listen(PORT, () => {
        //     console.log(`Server started on port ${PORT}`);
        // });

        app.listen(PORT, () => {
        });

        //const wss = new WebSocket.Server({ server });

        // wss.on('headers', (headers, request) => {
        //     headers.push('Access-Control-Allow-Origin: https://localhost:3000');
        //     headers.push('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        //     headers.push('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        // });

        // wss.on('connection', (socket) => {
        //   const clientId = uuidv4();
        //   console.log('New client connected:', clientId);
    
    
        //   setTimeout(() => {
        //     const message = 'Благодарим за использование нашего сервиса, удачных покупок!';
        //     socket.send(message);
        //   }, 60000);
    
        //   socket.on('close', () => {
        //     console.log('Client disconnected:', clientId);
        //   });
        // });
    } catch (e) {
        console.log(e)
    }
}

start()