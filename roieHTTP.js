const eventsMechanism = require("./eventMechanism");
const parse = require("./Utils/parse");
const net = require("net");
const fs = require("fs");

const packetBuilder = require("./Utils/packetBuilder");

function page404(req) {
    try {
        const page404 = fs.readFileSync("404.html", "utf-8");

        return packetBuilder.response(
            req.version,
            404,
            {"Content-Type": "text/html; charset=utf-8"},
            `${page404}`
        );
    }
    catch {
        return packetBuilder.response(
            req.version,
            404,
            {"Content-Type": "text/html; charset=utf-8"},
            `404 Not found`
        )
    }
}


const handleNewConnection = function(socket) {
  socket.on("data", (data) =>{
        let req =  parse.parser(data);
        
        if(!eventsMechanism.isHandlerExists(req.method, req.path)) {
            const notFoundResponse =  page404(req);

            socket.write(notFoundResponse.toString());
            socket.destroy();
            return;
        }
        
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