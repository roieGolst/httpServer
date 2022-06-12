const eventsMechanism = require("./eventMechanism");
const parse = require("./parse");
const net = require("net");

const handleNewConnection = function(socket) {
  socket.on("data", (data) =>{
      let req =  parse.parser(data); 
      console.log(req);

      eventsMechanism.emit(req.method, req.path, {
          send:  function (body) {
            socket.write(`HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8\r\n
            \r\n${body}`);
      
            socket.destroy();
          }
      })
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
    }

};