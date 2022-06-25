const checkList = require("../lib");

class ResponsePacketBuilder {
    #version;
    #statusCode;
    #headers
    #body
    
    constructor(version, statusCode, headers, body) {
        this.#isValidArguments(version, statusCode, headers, body);

        if(!this.#getStatus(statusCode)) {
            throw Error("Invalid status code");
        }

        this.#version = version,
        this.#statusCode = {
            statusNum: statusCode,
            statusDescription : checkList.statusCodeList[statusCode],
        }
        this.#headers = this.#headerToString(headers),
        this.#body = body 
    }

    #getStatus(statusCode) {
        return checkList.statusCodeList[statusCode];
    }

    #isValidArguments(version, statusCode, headers, body) {
        if(! version instanceof String) {
            throw Error(`Version argument have to be a "String"`);
        }

        if(! (typeof statusCode == "number")) {
            throw Error(`Number argument have to be a "Number"`);
        }

        if(!(headers instanceof Object)) {
            throw Error(`Header/s have to be a "Object"`);
        }
    }

    #headerToString(headers) {
        let stringHeaders = '';
        for (let prototype in headers) {
            stringHeaders += `${prototype}: ${headers[prototype]}\r\n`;
        }

        return stringHeaders;
    }

    toString() {
        if(!this.#body){
            return {packet: `${this.#version} ${this.#statusCode.statusNum} ${this.#statusCode.statusDescription}\n${this.#headers}`}
        }
        return {
            "packet": `${this.#version} ${this.#statusCode.statusNum} ${this.#statusCode.statusDescription}\n${this.#headers}\n`,
            "payload": this.#body
        }
    }
}

class RequestPacketBuilder {

    #method;
    #path;
    #version;
    #headers;
    #body;

    constructor(methodName, path, version, headers, body) {
        this.#isValidArguments(methodName, path, version, body);

        this.#method = this.#isMethodExsits(methodName),
        this.#path = path,
        this.#version =this.#isVersionExsits(version),
        this.#headers = this.#headerToString(headers),
        this.#body = body
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

    #headerToString(headers) {
        let stringHeaders = '';
        for (let prototype in headers) {
            stringHeaders += `${prototype}: ${headers[prototype]}\r\n`;
        }

        return stringHeaders;
    }

    toString() {
        if(!this.#body){
            return `${this.#method} ${this.#path} ${this.#version}\r\n${this.#headers}\r\n`
        }
        return `${this.#method} ${this.#path} ${this.#version}\r\n${this.#headers}\r\n${this.#body}`;
    }
}


module.exports = {
    request: function(methodName, path, version, headers, body){
        return new RequestPacketBuilder(methodName, path, version, headers, body);
    },
    response: function(version, statusCode, headers, body) {
        return new ResponsePacketBuilder(version, statusCode, headers, body);
    }
};




//example for new response instance
// const response = new ResponsePacketBuilder(
//     "HTTP/1.1", 
//     404, 
//     {Host: 'localhost:8124', Connection: 'keep-alive', 'Cache-Control': 'max-age=0'}, 
//     "body <html></html>......"
// );

// console.log(response.toString());

//example for new response instance
// const request = new RequestPacketBuilder(
//     "GET",
//      "/HelloWorld",
//       "HTTP/1.1"
//       , {Host: 'localhost:8124', Connection: 'keep-alive', 'Cache-Control': 'max-age=0'},
//        "lalalalala"
// );

// console.log(request.toString());
