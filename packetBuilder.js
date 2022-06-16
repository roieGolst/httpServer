const checkList = require("./lib");

class responsePacketBuilder {

    #statusCodeLocation;

    constructor(version, statusCode, headers, body) {
        this.#isValidArguments(version, statusCode, headers, body);

        this.version = version,
        this.#statusCodeLocation = this.#getStatus(statusCode),
        this.statusCode = {
            statusNum: checkList.statusCodeList[this.#statusCodeLocation].id,
            statusDescription : checkList.statusCodeList[this.#statusCodeLocation].val,
        }
        this.headers = this.#headerToString(headers),
        this.body = body 
    }

    #getStatus(statusCode) {
        return checkList.statusCodeList.map(object => (object.id)).indexOf(statusCode);
    }

    #isValidArguments(version, statusCode, headers, body) {
        if(! (typeof version == "string") || version instanceof String) {
            throw Error(`Version argument have to be a "String"`);
        }

        if(! (typeof statusCode == "number")) {
            throw Error(`Number argument have to be a "Number"`);
        }

        if(!(headers instanceof Object)) {
            throw Error(`Header/s have to be a "Object"`);
        }

        return;
    }

    #headerToString(headers) {
        var stringHeaders = '';
        for (let p in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, p)) {
                stringHeaders += p + ':' + " " + headers[p] + '\r\n';
            }
        }
        return stringHeaders;
    }

    toString() {
        if(!this.body){
            return `${this.version} ${this.statusCode.statusNum} ${this.statusCode.statusDescription}\r\n${this.headers}\r\n`
        }
        return `${this.version} ${this.statusCode.statusNum} ${this.statusCode.statusDescription}\r\n${this.headers}\r\n${this.body}`
    }
}

class requestPacketBuilder {

    constructor(methodName, path, version, headers, body) {
        this.#isValidArguments(methodName, path, version, body);

        this.method = this.#isMethodExsits(methodName),
        this.path = path,
        this.version =this.#isVersionExsits(version),
        this.headers = this.#headersToString(headers),
        this.body = body
    }

    


    #isValidArguments(methodName, path, version, body) {
        if(! (typeof methodName == "string") || (methodName instanceof String)) {
            throw Error(`Method have to be type of "String"`);
        }

        if(! (typeof path == "string") || (path instanceof String)) {
            throw Error(`Path have to be type of "String"`);
        }

        if(! (typeof version == "string") || (version instanceof String)) {
            throw Error(`Version have to be type of "String"`);
        }

        return;
    }

    #isMethodExsits(methodName) {
        if(checkList.methodList.indexOf(methodName) == -1) {
            throw Error(`Invalid method name\r\n Try to write in capital letters like:("GET") `)
        }

        return methodName;
    }

    #isVersionExsits(version) {
        if(checkList.versionList.indexOf(version) == -1) {
            throw Error(`Invalid version`);
        }

        return version;
    }

    #headersToString(headers) {
        var stringHeaders = '';
        for (let p in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, p)) {
                stringHeaders += p + ':' + " " + headers[p] + '\r\n';
            }
        }
        return stringHeaders;
    }

    toString() {
        if(!this.body){
            return `${this.method} ${this.path} ${this.version}\r\n${this.headers}\r\n`
        }
        return `${this.method} ${this.path} ${this.version}\r\n${this.headers}\r\n${this.body}`;
    }
}


module.exports = {
    request: function(methodName, path, version, headers, body){
        return new requestPacketBuilder(methodName, path, version, headers, body);
    },
    response: function(version, statusCode, headers, body) {
        return new responsePacketBuilder(version, statusCode, headers, body);
    }
}




//example for new response instance
// const response = new responsePacketBuilder(
//     "HTTP/1.1", 
//     404, 
//     {Host: 'localhost:8124', Connection: 'keep-alive', 'Cache-Control': 'max-age=0'}, 
//     "body <html></html>......"
// );

// console.log(response.toString());

//example for new response instance
// const request = new requestPacketBuilder(
//     "GET",
//      "/HelloWorld",
//       "HTTP/1.1"
//       , {Host: 'localhost:8124', Connection: 'keep-alive', 'Cache-Control': 'max-age=0'},
//        "lalalalala"
// );

// console.log(request.toString());
