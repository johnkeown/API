require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
var endpoints = require("./endpoints");

app.use(cors());
app.use("/", endpoints);

// app.get("/", (req, res) => {
//     res.send("");
// });

app.listen(port, () => {
    console.log(`API app listening on port ${port}`);
});
