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
    var returnObj = {};

    // check for uploaded file
    if (!req.files) {
        console.log("No file was uploaded");
        res.status(400).send("No file was uploaded");
    }

    const inspectionsFile = req.files.inspectionsFile;
    let uploadJson = await csvtojson()
        .fromFile(inspectionsFile.tempFilePath)
        .then((jsonObj) => {
            return jsonObj;
        });

    var newInspectionTypes = await findNewInspectionTypes(uploadJson);
    returnObj.inspectionTypes = newInspectionTypes;

    var newEstablishmentTypes = await findNewEstablishmentTypes(uploadJson);
    returnObj.establishmentTypes = newEstablishmentTypes;

    // get all establishments from upload
    const valuesEstablishments = uploadJson.map((data) => {
        return {
            source_id: data.EstablishmentID,
            name: data.EstablishmentName,
            address: data.Address,
            city: data.City,
            state: data.State,
            zip: data.Zip,
        };
    });

    console.log("Establishments", valuesEstablishments.length);
    console.log("Establishment 1", valuesEstablishments[0]);

    // get all inspections from upload
    const valuesInspections = uploadJson.map((data) => {
        return {
            establishment_id: data.EstablishmentID,
            source_id: data.InspectionID,
            inspection_type_id: data.Ins_TypeDesc,
            date: data.InspectionDate,
            score: data.score,
            grade: data.Grade,
        };
    });

    console.log("Inspection 1", valuesInspections[0]);

    res.json(returnObj);
});

function getDistinctInspectionTypesSorted(uploadJson) {
    return _.keys(
        _.countBy(uploadJson, (data) => {
            return data.Ins_TypeDesc;
        })
    ).sort();
}

function getDistinctEstablishmentTypesSorted(uploadJson) {
    return _.keys(
        _.countBy(uploadJson, (data) => {
            return data.TypeDescription;
        })
    ).sort();
}

async function getDbInspectionTypes() {
    var results = await databaseHandler.query(
        "SELECT value FROM lu_inspection_type"
    );

    if (results.error) {
        console.log("Error getting inspection types from db");
        return [];
    }

    return results.rows;
}

async function getDbEstablishmentTypes() {
    var results = await databaseHandler.query(
        "SELECT id, value FROM lu_establishment_type"
    );

    if (results.error) {
        console.log("Error getting establishment types from db");
        return [];
    }

    return results.rows;
}

async function findNewInspectionTypes(uploadJson) {
    // get all inspection types from upload
    const uploadInspectionTypes = getDistinctInspectionTypesSorted(uploadJson);

    // get all saved inspection types from db
    const dbInspectionTypes = await getDbInspectionTypes();

    // return new inspection types
    return uploadInspectionTypes.filter(function (item) {
        return dbInspectionTypes.indexOf(item) === -1;
    });
}

async function findNewEstablishmentTypes(uploadJson) {
    // get all establishment types from upload
    const uploadEstablishmentTypes =
        getDistinctEstablishmentTypesSorted(uploadJson);

    // get all saved establishemnt types from db
    const dbEstablishmentTypes = await getDbEstablishmentTypes();

    // return new establishment types
    return uploadEstablishmentTypes.filter(function (item) {
        return dbEstablishmentTypes.indexOf(item) === -1;
    });
}

module.exports = router;
