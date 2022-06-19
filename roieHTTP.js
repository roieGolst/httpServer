const eventsMechanism = require("./eventMechanism");
const packetBuilder = require("./Utils/packetBuilder");
const net = require("net");
const SocketManagerClass = require("./Utils/socketManager");


const handleNewConnection = function(socket) {
    const socketManager = new SocketManagerClass(socket);

    socketManager._fetchData();
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