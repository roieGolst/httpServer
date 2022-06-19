const eventsMechanism = require("../eventMechanism");
const parse = require("./parse");
const packetBuilder = require("./packetBuilder");
const fs = require("fs");

class SocketManager {
    #socket;

    constructor(socket) {
        this.#socket = socket;
    }

    #requestParser(request) {
        try {
            return parse.parser(request);
        }
        catch(err) {
            console.error(`Parser error: ${err}`);
            return false;
        } 
    }

    #page404(req) {
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

    send(responsePacket) {
        this.#socket.write(responsePacket);
        this.#socket.destroy();
    }

    _fetchData() {

        this.#socket.on("error", (err) => {
            console.error(err);

            this.#socket.destroy();
            return;
        });
    
        this.#socket.on("data", (data) =>{
            let req =  this.#requestParser(data);

            if(!req) {
                return;
            }
            
            if(!eventsMechanism.isHandlerExists(req.method, req.path)) {
                const notFoundResponse = this.#page404(req);
    
                this.#socket.write(notFoundResponse.toString());
                this.#socket.destroy();
                return;
            }
            
            eventsMechanism.emit(req.method, req.path, req, this)

      });
    }
}
module.exports = SocketManager;