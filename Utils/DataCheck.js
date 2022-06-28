const parser = require("./parse");
const path = require("path");
const fs = require("fs");

class DataCheck {

    requestParser(request) {
        try {
            return parser(request);
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

    getContentType(fileType) {
        switch(fileType) {
            case "html":
            case "css":
                return `text/${fileType}`;

            case "js":
                return `text/javascript`;
                
            case "gif":
            case "png":
            case"svg":
            case"webp":
            case "jpg":
            case "mp4":
                return `image/${fileType}`;       
        }
    }

    getDefaultHeaders(file) {
        
        const ContentType = this.getContentType(file.type);

        return {
            "Content-Type": ContentType,
            "Content-length": `${file.data.byteLength}`,
            "Date": `${new Date().toISOString().slice(0,10)}`,
            "server": "roieHTTP"
        }
    }
}

module.exports = DataCheck;