const express = require("express")
const sio     = require("socket.io")
const nssh    = require("node-ssh")

const app = express()
app.set("port", "7000")

const server = app.listen(app.get("port"), () => {
  console.log("listening on", app.get("port"))
})

app.get("/", (req, res) => {
  console.log("hi /")
  res.sendFile(__dirname + "/shocker.html")
})

const io = sio(server)
const show = io.of("/")

const shock = () => {
  console.log("shocking...")
}

show.on("connection", (socket) => {
  console.log("audience connected")
  socket.on("shock", () => {
    shock()
  })
})
