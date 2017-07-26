import execa from 'execa'
import ms from 'ms'

let body = []

const FTP_COMMAND_TEMPLATE = `\
exec /usr/bin/timeout 120 /usr/bin/ftp -in $FTP_HOST $FTP_PORT <<EOF
user $FTP_USER $FTP_PASS
bin

ls $FTP_DIR

bye
EOF
`

const {stdout} = execa.shell(FTP_COMMAND_TEMPLATE, {
  env: {
    FTP_HOST: process.env['FTP_HOST'],
    FTP_PORT: process.env['FTP_PORT'],
    FTP_USER: process.env['FTP_USER'],
    FTP_PASS: process.env['FTP_PASS'],
    FTP_DIR: process.env['FTP_DIR']
  },
  timoute: ms('30 seconds')
})

stdout.on('data', function (result) {
  console.log(result.toString())
  body.push(result)
})

stdout.on('error', function (err) {
  console.log(err)
})

stdout.on('end', function () {
  // console.log(body)
  console.log('done...')
})
