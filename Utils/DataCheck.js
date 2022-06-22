const parser = require("./parse");
const path = require("path");
const fs = require("fs");

class DataCheck {

    requestParser(request) {
        try {
            return parser.parser(request);
        }
        catch(err) {
            console.error(`Parser error: ${err}`);
            return false;
        } 
    }

    isValidPaht(serchPath) {
        const safeInput = path.normalize(serchPath);

        if(safeInput == "" || safeInput == "\\") {
            return false
        }
        
        return path.join(require.main.path, "public", safeInput);
    }

    readFile(filePath) {
        if(!filePath || filePath == "/") {
            return false;
        }

        const safePath =  this.isValidPaht(filePath);
        
        
        if(!safePath) {
            return false;
        }

        if(!fs.existsSync(safePath)) {
            console.error(safePath);
            console.error("Unacceptable path");
            return false;
        }

        return {
            data: fs.readFileSync(safePath),
            type: path.extname(filePath).slice(1)
        };
    }

    getContentTypeHeader(fileType) {
        switch(fileType) {
            case "html":
                return {"Content-Type": "text/html; charset=utf-8"};
            case "css":
                return {"Content-Type": "text/css"};
            case "js":
                return {"Content-Type": "text/js"};
            case "jpg":
                return {"Content-Type": "image/jpeg"};
            case "png":
                return {"Content-Type": "image/png"};
        }
    }
}

module.exports = DataCheck;