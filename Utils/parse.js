const checkList = require("../lib");

const METHOD_POSTION = 0;
const PATH_POSTION = 1;
const VERSION_POSTION = 2;
const PARAMERS_POSTION = 1;

function parser(data) {
    
    if(!(data instanceof Buffer)) {
        throw Error("invalid packet type");
    }

	const parseData = data.toString("utf8").split("\r\n");

    if(parseData.length < 1) {
        throw Error("Invalid data length");
    }

    let rowMethod = rowMethodParse(parseData[0].split(" "))

    const method = rowMethod.mathod;
    const path = rowMethod.path;
    const version = rowMethod.version;

    let parametres;

    if(!rowMethod.parametres) {
        parametres = undefined;
    }

    const headers = {};
    let headersLength = 1;

    while(headersLength < parseData.length && parseData[headersLength] != "") {
        const parsedHeader = parseData[headersLength].split(": ");    
        
        if(parsedHeader.length > 2){
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

    let body = bodyParser(parserBody.join(""));

    const req = {
        method,
        path,
        parametres,
        version,
        headers,
        body
    };
    
    return req;
}

function rowMethodParse(rowMethod) {
    if(rowMethod.length == 3) {
        if(checkList.methodList.indexOf(rowMethod[METHOD_POSTION]) == -1) {
            throw Error("invalid method");
            
        }

        if(checkList.versionList.indexOf(rowMethod[VERSION_POSTION]) == -1) {
            throw Error("invalid version");
        }

        const isParametersExists = rowMethod[PATH_POSTION].split("?");

        let parametersAndPath;
        
        if(isParametersExists.length >= 2) {
            parametersAndPath =  parametrsParse(isParametersExists);
        }
        
        else{
            return {
                mathod: rowMethod[METHOD_POSTION],
                path: rowMethod[PATH_POSTION],
                version: rowMethod[VERSION_POSTION]
            }
        }

        return {
            mathod: rowMethod[METHOD_POSTION],
            path: parametersAndPath.path,
            parametrs: parametersAndPath.parametres,
            version: rowMethod[VERSION_POSTION]
        }
        
    }
    else {
        throw Error("invalid request");
    }
}

function parametrsParse(parametresRow) {
    const parametres = {}

    const arrayParametrs = parametresRow[PARAMERS_POSTION].split("&");

    for(let i in arrayParametrs) {
        let strParametres = arrayParametrs[i].split("=");

        parametres[strParametres[0]] = strParametres[1];
    }

    return {
        path: parametresRow[0],
        parametres
    }
}

function bodyParser(body) {
    const bodyObject = {}

    const arrayBodyData = body.split("&");

    for(let i in arrayBodyData) {
        let strBody = arrayBodyData[i].split("=");

        if(strBody == "") {
            return undefined;
        }
        bodyObject[strBody[0]] = strBody[1];
    }

    return bodyObject;
}

module.exports = parser