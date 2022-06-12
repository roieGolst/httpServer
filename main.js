const roieHTTP = require("./roieHTTP");;
const PORT = 8124;

roieHTTP.get("/HelloWorld", (res) => {
    console.log("lalalalla");

    res.send(`<h1>I did it</h1>`)
});

roieHTTP.post("/HelloWorld", (res) => {
    console.log("Hellow from POST fun");

    res.send("Hello from post fun");
})

// roieHTTP.post("/HelloWorld", () => {
//     console.log("lalalalla");
// })

roieHTTP.bootstrap(PORT, () => {
    console.log("server bound");
});
