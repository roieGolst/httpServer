const roieHTTP = require("./roieHTTP");;
const PORT = 8124;

roieHTTP.get("/HelloWorld", (req, res) => {


    console.log(req);

    res.send(`<h1>I did it</h1>`)
});

roieHTTP.post("/HelloWorld", (req, res) => {
    console.log(req);

    res.send("Hello from post fun");
})

roieHTTP.bootstrap(PORT, () => {
    console.log("server bound");
});