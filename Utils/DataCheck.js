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

    getDefaultHeaders(file) {
        const headerObject = {
            "Content-length": `${file.data.byteLength}`,
            "Date": `${new Date().toISOString().slice(0,10)}`,
            "server": "roieHTTP"
        }
        switch(file.type) {
            case "html" || "css":
                headerObject["Content-Type"] = `text/${file.type}`;
                break;
            case "js":
                headerObject["Content-Type"] = `text/javascript`;
                break;
            case "gif"|| "jpeg"|| "png" || "svg" ||"webp":
                headerObject["Content-Type"] = `image/${file.type}`; 
                break;       
        }

        return headerObject;
    }
}

module.exports = DataCheck;