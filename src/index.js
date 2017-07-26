import http from 'http'
import execa from 'execa'
import ms from 'ms'

let body = []

const port = process.env['PORT']
const ftpHost = process.env['FTP_HOST']
const ftpPort = process.env['FTP_PORT']
const ftpUser = process.env['FTP_USER']
const ftpPass = process.env['FTP_PASS']
const ftpDir = process.env['FTP_DIR']

const FTP_COMMAND_TEMPLATE = `\
exec /usr/bin/timeout 120 /usr/bin/ftp -in $FTP_HOST $FTP_PORT <<EOF
user $FTP_USER $FTP_PASS
bin

ls $FTP_DIR

bye
EOF
`

const server = http.createServer((req, res) => {
  const {stdout} = execa.shell(FTP_COMMAND_TEMPLATE, {
    env: {
      FTP_HOST: ftpHost,
      FTP_PORT: ftpPort,
      FTP_USER: ftpUser,
      FTP_PASS: ftpPass,
      FTP_DIR: ftpDir
    },

    timeout: ms('30 seconds')
  })

  stdout.on('data', function (result) {
    // console.log(result.toString())
    body.push(result)
  })

  stdout.on('error', function (err) {
    console.log(err)
  })

  stdout.on('end', function () {
    res.setHeader('Content-Type', 'application/json')
    res.write(body.toString())
    res.end()
  })
})

server.on('listening', () => {
  console.log(`listening on port ${port}...`)
})

server.on('request', (req, res) => {
  console.log(req.method, req.url)
})

server.listen(port)
