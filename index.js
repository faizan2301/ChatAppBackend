const app = require("express")();
// const http = require("http").createServer(app);
const { Server } = require("ws");
// http.listen(8080);
app.get("/", (req, res) => {
  res.send("Node Server is running. Yay!!");
});

// const socketio = require("socket.io")(http);
const server = app.listen(8080, () => console.log(`Listening on ${8080}`));
const wss = new Server({ server });

var webSockets = {};

wss.on("connection", function (ws, req) {
  var userID = req.url.substr(1); //get userid from URL/userid
  webSockets[userID] = ws; //add new user to the connection list
  console.log("User connected:", userID);
  ws.on("message", (message) => {
    // If there is any message
    var datastring = message.toString();
    if (datastring.charAt(0) == "{") {
      // Check if message starts with '{' to check if it's json
      datastring = datastring.replace(/\'/g, '"');
      var data = JSON.parse(datastring);
      if (data.auth == "chatappauthkey231r4") {
        var boardws = webSockets[data.userid]; // Send to connected user
        var msg =
          "{'cmd':'message','msg':'" +
          data.msg +
          "','from':'" +
          data.from +
          "'}";
        boardws.send(msg);
      }
    }
  });
});
