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
        let root = path.join(require.main.path, "public");

        let safe_input = path.normalize(serchPath).replace(/^(\.\.(\/|\\|$))+/, '');
        let path_string = path.join(root, safe_input);


        if (path_string.indexOf(root) !== 0 || safe_input == "\\") {
            return false;
        }

        return path_string;
        }

    isFileExists(filePath) {
        if(filePath == "/" || !filePath) {
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
            data: fs.readFileSync(safePath, "utf-8"),
            type: path.extname(filePath)
        };
    }

    getContentTypeHeader(fileType) {
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

module.exports = DataCheck;