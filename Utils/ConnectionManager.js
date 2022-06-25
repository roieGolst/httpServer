const eventsMechanism = require("../eventMechanism");
const packetBuilder = require("./packetBuilder");
const fs = require("fs");

const PAGE_404_CONTENT = page404Content();
class ConnectionManager {

    #socket;
    #dataCheck;

    constructor(socket, dataCheck) {
        this.#socket = socket,
        this.#dataCheck = dataCheck
    }

    init() {
        
        this.#socket.on("error", (err) => {
            console.error(err);
            this.#socket.destroy();
        })
    
        this.#socket.on("data", (data) =>{
            const req =  this.#dataCheck.requestParser(data);
            

            if(!req) {
                this.#destroy();
                return;
            }

            if(req.method == "GET") {
                const file = this.#dataCheck.readFile(req.path);

                if(file){
                    const responsePacket = packetBuilder.response(
                        req.version,
                        200,
                        this.#dataCheck.getContentTypeHeader(file),
                        file.data
                    );

                    this.send(responsePacket.toString());
                    return;
                }
                
            }

            if(!eventsMechanism.isHandlerExists(req.method, req.path)) {
                this.#page404();
                return;
            }

            eventsMechanism.emit(req.method, req.path, req, this);
      });
    }

    
    send(responsePacket) {
        if(!responsePacket["payload"]) {
            this.#socket.write(responsePacket["packet"]);
            this.#destroy()
        }

        this.#socket.write(responsePacket["packet"]);
        this.#socket.write(responsePacket["payload"]);
        this.#destroy()
     }
    
    #destroy() {
        this.#socket.destroy();
    }

    #page404() {
       this.send(PAGE_404_CONTENT.toString());
    }
}

function page404Content() {
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

module.exports = ConnectionManager;