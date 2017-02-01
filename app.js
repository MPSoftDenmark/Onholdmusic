let http = require('http')
let express = require('express')
let config = require('./config')
let Radio = require('./src/index').default

const app = express()
const server = http.createServer(app)

let port = process.env.PORT || config.httpPort

app.radio = Radio(server, config)

app.get('/stream', (req, res) => {
  let listener = app.radio.addListener(req, res)
  req.connection.on('close', () => app.radio.removeListener(listener))
})

server.listen(port, () => {
  console.log('Server listening on port', port)
})
