const eventsMechanism = require("./eventMechanism");
const parse = require("./parse");
const net = require("net");

const packetBuilder = require("./httpPacketBuilder");

const handleNewConnection = function(socket) {
  socket.on("data", (data) =>{
      let req =  parse.parser(data);

      eventsMechanism.emit(req.method, req.path, req, {send: function(responsePacket) {
          socket.write(responsePacket);
      }});
  });
};

// class socketMethod {
//     constructor(socket) {
//         this.socket = socket
//     }

//     send(body) {
//       this.socket.write(`HTTP/1.1 200 OK
//       Content-Type: text/html; charset=utf-8\r\n
//       \r\n${body}`);

//       this.socket.destroy();
//     }

//     notFound(page404) {
//         this.socket.write(`HTTP/1.1 404 Not found
//         Content-Type: text/html; charset=utf-8\r\n
//         \r\n${page404}`);
  
//         this.socket.destroy();
//       }  
//     }


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