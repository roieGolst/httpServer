const roieHTTP = require("./roieHTTP");;
const PORT = 8124;

roieHTTP.get("/", (req, res) => {
    const response = roieHTTP.packetBuilder.response(
        req.version, 
        200, 
        {"Content-Type": "text/html; charset=utf-8"},
        `<h1>I did itttttt</h1>`)

    res.send(response.toString());
});

roieHTTP.post("/HelloWorld", (req, res) => {
    console.log(req);

    res.send("Hello from post fun");
})

roieHTTP.bootstrap(PORT, () => {
    console.log("server bound");
});