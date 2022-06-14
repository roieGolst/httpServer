const { statusCodeList } = require("./lib");

class responseBuilder {
    constructor(req, socket) {
        this.request = req,
        this.socket = socket,
        this.responseObject = {} 
    }

    writeHead(statusCode, headerObject) {
        const location = this.#isStatusCodeExsits(statusCode)
        if(location == -1) {
            throw Error("Invalid statis code");
        }

        this.responseObject["statusCode"] = statusCodeList[location].id && statusCodeList[location].val

        this.responseObject["headers"] =  this.#headerBuilder(headerObject);

        console.log(this.responseObject);
    
    }

    #isStatusCodeExsits(statusCode) {
        return statusCodeList.map(object => object.id).indexOf(statusCode)
    }

    #headerBuilder(headerObject) {

        const headerToParse = Object.entries(headerObject);

        const builedHedar = []

        for(let i = 0; i < headerToParse.length; i++) {
            builedHedar[i] = [];
            builedHedar[i].push(headerToParse[i][0]);
            builedHedar[i].push(headerToParse[i][1]);
        }

        return builedHedar.split()
    }
}

let test = new responseBuilder("asdasd", "lalsdlasld");

test.writeHead(200, {"contebt": "lalalall", "lalalalala": "blalblablalb"});