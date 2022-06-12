const checkList = require("./lib");

const METHOD_POSTION = 0;
const PATH_POSTION = 1;
const VERSION_POSTION = 2;

function parse(data) {
    // if data == buffer WIP!!!
    if(!data) {
        throw Error("invalid packet type");
    }

	const parseData = data.toString("utf8").split("\r\n");

    if(parseData.length < 1) {
        throw Error("Invalid data length");
    }

    const rowMethod = parseData[0].split(" ");

    if(rowMethod.length == 3) {
        if(checkList.methodList.indexOf(rowMethod[METHOD_POSTION]) == -1) {
            throw Error("invalid method");
            
        }

        if(!checkList.versionList.indexOf(rowMethod[VERSION_POSTION]) == -1) {
            throw Error("invalid version");
        }
    }
    else {
        throw Error("invalid request");
    }

    const method = rowMethod[METHOD_POSTION];
    const path = rowMethod[PATH_POSTION];
    const version = rowMethod[VERSION_POSTION];

    const headers = {};
    let headersLength = 1;

    while(headersLength < parseData.length && parseData[headersLength] != "") {
        const parsedHeader = parseData[headersLength].split(": ");    
        
        if(parsedHeader.length > 2){
            console.log(parsedHeader);
            throw Error("Invalid Header");
        }

        headers[parsedHeader[0]] = parsedHeader.slice(1).join("");
        headersLength++;
    }

    const bodyStartPostion = headersLength;
    const parserBody = [];
    
    for(let i = bodyStartPostion; i < parseData.length; i++) {
        parserBody.push(parseData[i]);
    }

    let body = parserBody.join("");

    if(body == "") {
        body = undefined;
    }

    const req = {
        method: method,
        path: path,
        version: version,
        headers: headers,
        body: body
    };
    
    return req;
}

module.exports = {
    parser: parse,
}