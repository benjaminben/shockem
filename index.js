fs      = require("fs")
express = require("express")
sio     = require("socket.io")
nssh    = require("node-ssh")

app = express()
app.set("port", "7000")

server = app.listen(app.get("port"), () => {
  console.log("listening on", app.get("port"))
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/shocker.html")
})

const ssh = new nssh()

var shock_on = () => {
  console.log("shocking...")
  ssh.execCommand(`sudo ./shockon`).then((result) => {
    console.log(`STDOUT: ${result.stdout}`)
    console.log(`STDERR: ${result.stderr}`)
  })
}
var shock_off = () => {
  console.log("shocking...")
  ssh.execCommand(`sudo ./shockoff`).then((result) => {
    console.log(`STDOUT: ${result.stdout}`)
    console.log(`STDERR: ${result.stderr}`)
  })
}

var io
var show

initIo = () => {
  io = sio(server)
  show = io.of("/")

  show.on("connection", (socket) => {
    console.log("audie connected")
    socket.on("shock_on", () => {
      shock_on()
    })
    socket.on("shock_off", () => {
      shock_off()
    })
  })
}

ssh.connect({
  port: process.argv[2],
  username: process.argv[3],
  host: process.argv[4],
  privateKey: process.argv[5],
})
.then(() => {
  initIo()
})
