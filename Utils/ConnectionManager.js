const eventsMechanism = require("../eventMechanism");
const parse = require("./parse");
const packetBuilder = require("./packetBuilder");
const fs = require("fs");
const path = require("path");

// class Manager {
//     #socket;

//     constructor(socket) {
//         this.#socket = socket;
//     }

//     #requestParser(request) {
//         try {
//             return parse.parser(request);
//         }
//         catch(err) {
//             console.error(`Parser error: ${err}`);
//             return false;
//         } 
//     }

//     #page404(req) {
//         try {
//             const page404 = fs.readFileSync("404.html", "utf-8");
    
//             return packetBuilder.response(
//                 req.version,
//                 404,
//                 {"Content-Type": "text/html; charset=utf-8"},
//                 `${page404}`
//             );
//         }
//         catch {
//             return packetBuilder.response(
//                 req.version,
//                 404,
//                 {"Content-Type": "text/html; charset=utf-8"},
//                 `404 Not found`
//             )
//         }
//     }

//     send(responsePacket) {
//         this.#socket.write(responsePacket);
//         this.#socket.destroy();
//     }

//     sharePublic(request, dirPath) {
//         let filepath;
//         let publicWeb = "";
//         fs.readdirSync(dirPath).forEach(file => {
//             if(path.extname(file)  == ".html"){
//                 filepath = path.join(dirPath, file);
//                 return;
//             }
//         });

//         publicWeb += fs.readFileSync(filepath);

//         const responsePacket = packetBuilder.response(
//             request.version,
//             200,
//             this.#getContentTypeHeader(".html"),
//             `${publicWeb}`
//         );

//         this.send(responsePacket.toString());
//     }

//     #isExsitsFile(filePath) {
//         if(filePath == "/" || !filePath) {
//             return false;
//         }

//         const serchPath = path.join("public", filePath);

        
//         if(!serchPath) {
//             return false;
//         }

//         if(!fs.existsSync(serchPath)) {
//             return false;
//         }

//         return {
//             data: fs.readFileSync(serchPath).toString("utf-8"),
//             type: path.extname(filePath)
//         };
//     }

//     #getContentTypeHeader(fileType) {
//         switch(fileType) {
//             case ".html":
//                 return {"Content-Type": "text/html; charset=utf-8"};
//             case ".css":
//                 return {"Content-Type": "text/css"};
//             case ".js":
//                 return {"Content-Type": "text/js"};
//         }
//     }

//     #isSocketError() {
//         this.#socket.on("error", (err) => {
//             console.error(err);

//             this.#socket.destroy();
//             return;
//         });
//     }

//     _fetchData() {

//         this.#isSocketError();
        
    
//         this.#socket.on("data", (data) =>{
//             const req =  this.#requestParser(data);
//             const file = this.#isExsitsFile(req.path);

//             if(!req) {
//                 return;
//             }

//             if(!file && !eventsMechanism.isHandlerExists(req.method, req.path)) {
//                 const page404 = this.#page404(req);
//                 this.send(page404.toString());
//             }

//             if(file) {
//                 const responsePacket = packetBuilder.response(
//                     req.version,
//                     200,
//                    this.#getContentTypeHeader(file.type),
//                    `${file.data}`
//                 )

//                 this.send(responsePacket.toString())
//                 return;  
//             }


            
//             eventsMechanism.emit(req.method, req.path, req, this);
//       });
//     }
// }

class DataCheck {

    _requestParser(request) {
        try {
            return parse.parser(request);
        }
        catch(err) {
            console.error(`Parser error: ${err}`);
            return false;
        } 
    }

    _isExsitsFile(filePath) {
        if(filePath == "/" || !filePath) {
            return false;
        }

        const serchPath = path.join("public", filePath);

        
        if(!serchPath) {
            return false;
        }

        if(!fs.existsSync(serchPath)) {
            return false;
        }

        return {
            data: fs.readFileSync(serchPath, "utf-8"),
            type: path.extname(filePath)
        };
    }

    _getContentTypeHeader(fileType) {
        switch(fileType) {
            case ".html":
                return {"Content-Type": "text/html; charset=utf-8"};
            case ".css":
                return {"Content-Type": "text/css"};
            case ".js":
                return {"Content-Type": "text/js"};
            case ".jpg":
                return {"Content-Type": "image/jpeg"};
            case ".png":
                return {"Content-Type": "image/png"};
        }
    }
}

class ConnectionManager extends DataCheck {
    #socket;

    constructor(socket) {
        super();
        this.#socket = socket
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
            const req =  this._requestParser(data);
            const file = this._isExsitsFile(req.path);

            if(!req) {
                return;
            }

            if(!file && !eventsMechanism.isHandlerExists(req.method, req.path)) {
                const page404 = this.#page404();
                this.send(page404.toString());
            }

            if(file) {
                const responsePacket = packetBuilder.response(
                    req.version,
                    200,
                   this._getContentTypeHeader(file.type),
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