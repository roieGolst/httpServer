const eventsMechanism = require("../eventMechanism");
const packetBuilder = require("./packetBuilder");
const fs = require("fs");



class ConnectionManager {
    #socket;
    #DataCheck
    constructor(socket, DataCheck) {
        this.#socket = socket,
        this.#DataCheck = DataCheck
    }

    #page404() {
        try {
            const page404 = fs.readFileSync("404.html", "utf-8");
    
            return packetBuilder.response(
                `HTTP/1.1`,
                404,
                {"Content-Type": "text/html; charset=utf-8"},
                `${page404}`
            );
        }
        catch {
            return packetBuilder.response(
                `HTTP/1.1`,
                404,
                {"Content-Type": "text/html; charset=utf-8"},
                `404 Not found`
            )
        }
    }

    send(responsePacket) {
        this.#socket.write(responsePacket);
        this.#socket.destroy();
        return;
    }

    _fetchData() {

        this.#socket.on("error", (err) => {
            console.error(err);
            this.#socket.destroy();
        })
    
        this.#socket.on("data", (data) =>{
            const req =  this.#DataCheck.requestParser(data);
            const file = this.#DataCheck.isFileExists(req.path);

            if(!req) {
                return;
            }

            if(!file && !eventsMechanism.isHandlerExists(req.method, req.path)) {
                const page404 = this.#page404();
                this.send(page404.toString());
            }

            if(file && req.method == "GET") {
                const responsePacket = packetBuilder.response(
                    req.version,
                    200,
                   this.#DataCheck.getContentTypeHeader(file.type),
                   `${file.data}`
                )

                this.send(responsePacket.toString())
                return;  
            }


            
            eventsMechanism.emit(req.method, req.path, req, this);
      });
    }
}

module.exports = ConnectionManager;