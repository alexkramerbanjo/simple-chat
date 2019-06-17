var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const fs = require("fs");
const express = require("express");
path = require("path");
const port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", async function(socket) {
  console.log("a user connected");
  await fs.readFile("public/messages.txt", "utf8", (err, data) => {
    if (err) throw err;
    socket.emit("messages", data);
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
    fs.appendFile("public/messages.txt", "\n" + msg, err => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  });
});

http.listen(port, function() {
  console.log("listening on *:80");
});
