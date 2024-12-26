var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");
const { parse } = require("csv-parse");
const { Readable } = require("stream");
const databaseHandler = require("../../../../lib/databaseHandler/index.js");
const csvToArray = require("../../../../lib/csvToArray/index.js");
const fs = require("node:fs");
const csvtojson = require("csvtojson");
const _ = require("underscore");

router.post("/admin/importInspectionsUpload", async function (req, res) {
    console.log(req.files);
    if (!req.files) {
        console.log("No file was uploaded");
        res.status(400).send("No file was uploaded");
    }

    const file = req.files.inspectionsFile;
    let json = [];
    await csvtojson()
        .fromFile(file.tempFilePath)
        .then((jsonObj) => {
            json = jsonObj;
        });

    console.log(json[0]);

    // get all inspection types
    const valuesInsTypeDesc = _.keys(
        _.countBy(json, (data) => {
            return data.Ins_TypeDesc;
        })
    ).sort();
    console.log(valuesInsTypeDesc);

    // get all establishment types
    const valuesTypeDescription = _.keys(
        _.countBy(json, (data) => {
            return data.TypeDescription;
        })
    ).sort();
    console.log(valuesTypeDescription);
    res.send(req.files.inspectionsFile.data);
});

module.exports = router;
