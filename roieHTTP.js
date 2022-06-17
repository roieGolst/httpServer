const eventsMechanism = require("./eventMechanism");
const parse = require("./Utils/parse");
const net = require("net");
const fs = require("fs");

const packetBuilder = require("./Utils/packetBuilder");
function page404(socket, req) {
    if(!(eventsMechanism.isHandlerExists(req.method, req.path))) {
        const page404 = fs.readFileSync("404.html", "utf-8");
        const notFoundResponse = packetBuilder.response(
            req.version,
            404,
            {"Content-Type": "text/html; charset=utf-8"},
            `${page404}`
        );

        socket.write(notFoundResponse.toString());
        socket.destroy();
    }
}

const handleNewConnection = function(socket) {
  socket.on("data", (data) =>{
        let req =  parse.parser(data);

        page404(socket, req);

        eventsMechanism.emit(req.method, req.path, req, {send: function(responsePacket) {
            socket.write(responsePacket);
            socket.destroy();
        }});
  });
};

module.exports = {
    bootstrap: function(port, cb) {
        if(!port) {
            return Error("Ivalid port");
        }
        
        const server = net.createServer(handleNewConnection);
        
        server.listen(port, cb);
    },

    get: function(eventName, cb) {
        eventsMechanism.on("GET" , eventName, cb);
    },

    post: function(eventName, cb) {
        eventsMechanism.on("POST" , eventName, cb);
    },

    packetBuilder: packetBuilder

};