const methodMap = {};

function eventHandler(mapName,eventName, cb) {

    if(!cb) {
        throw Error("Invalid call back");
    }

    if(! (typeof eventName == "string") || eventName instanceof String) {
        throw Error("Event name heve to be a String");
    }

    if(!methodMap.mapName) {
        methodMap[mapName] = new Map();
    }

    if(methodMap[mapName].has(eventName)) {
        throw Error("This name is already exsits");
    }

    methodMap[mapName].set(eventName, cb);
}

function eventEmiter(mapName ,eventName, cb) {
    if(!(methodMap[mapName].has(eventName))) {
        return
    }

    if(! (typeof eventName == "string") || eventName instanceof String) {
        throw Error("Event name heve to be a String");
    }

    const eventVal = methodMap[mapName].get(eventName);

    if(!cb) {
        eventVal();
    }
    else {
        eventVal(cb);
    }
}

module.exports = {
    on: eventHandler,
    emit: eventEmiter
}

