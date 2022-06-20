const eventsMechanism = require("./eventMechanism");
const packetBuilder = require("./Utils/packetBuilder");
const net = require("net");
const ConnectionManager = require("./Utils/ConnectionManager");
const fs = require("fs");


const handleNewConnection = function(socket) {
    const cM = new ConnectionManager(socket);

    cM._fetchData();
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

    packetBuilder: packetBuilder,

    static: function(htmlFilePath) {
        eventsMechanism.on(`GET`, "/", (req, res) => {
            let file;
            try {

                file = fs.readFileSync(htmlFilePath);
                const responsePacket = packetBuilder.response(
                    `HTTP/1.1`,
                    200,
                    {"Content-Type": "text/html; charset=utf-8"},
                    `${file}`
                )
                res.send(responsePacket.toString());
            }
            catch (err){
                console.error(err);
            }
        })
    }

};