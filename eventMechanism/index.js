const methodMap = {};

function eventHandler(mapName,eventName, cb) {

    if(!cb) {
        throw Error("Invalid callback");
    }

    if(! (typeof eventName == "string") || eventName instanceof String) {
        throw Error("Event name heve to be a String");
    }

    if(!methodMap[mapName]) {
        methodMap[mapName] = new Map();
    }

    if(methodMap[mapName].has(eventName)) {
        throw Error("This name is already exsits");
    }

    methodMap[mapName].set(eventName, cb);
}

function isHandlerExists(mapName, eventName) {
    return methodMap[mapName] instanceof Map && methodMap[mapName].has(eventName);  
}

function eventEmiter(mapName ,eventName, request, response) {
    if(!isHandlerExists(mapName, eventName)) {
        return false;
    }

    if(! (typeof eventName == "string") || eventName instanceof String) {
        throw Error("Event name heve to be a String");
    }

    const handler = methodMap[mapName].get(eventName);
    
    handler(request, response);
}

module.exports = {
    on: eventHandler,
    emit: eventEmiter,
    isHandlerExists: isHandlerExists
}

