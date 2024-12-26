require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 8000;
var endpoints = require("./endpoints");

app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "uploads",
    })
);
app.use("/", endpoints);

// app.get("/", (req, res) => {
//     res.send("");
// });

app.listen(port, () => {
    console.log(
        `API app listening on port ${port} using node version ${process.version}`
    );
});
