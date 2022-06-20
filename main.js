const roieHTTP = require("./roieHTTP");;
const PORT = 8124;
const path = require("path");
const public = path.join("public", "index.html");

// roieHTTP.get("/", (req, res) => {
//     res.sharePublic(req, public);
// });

roieHTTP.static(public);

roieHTTP.get("/hello", (req, res) => {
    const response = roieHTTP.packetBuilder.response(
        req.version, 
        200, 
        {"Content-Type": "text/html; charset=utf-8"},
        `<h1>I did itttttt</h1>`
    );

    res.send(response.toString());
})

roieHTTP.post("/HelloWorld", (req, res) => {
    console.log(req);

    res.send("Hello from post fun");
})

roieHTTP.bootstrap(PORT, () => {
    console.log("server bound");
});