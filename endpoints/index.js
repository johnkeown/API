var express = require("express"),
    router = express.Router();

var restaurantInspectionsRoutes = require("./restaurantInspections");

router.use("/restaurantInspections", restaurantInspectionsRoutes);

module.exports = router;
