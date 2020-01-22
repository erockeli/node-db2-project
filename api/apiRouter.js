const router = require("express").Router();

const carsRouter = require("./cars/carsRouter");


router.use("/cars", carsRouter);

module.exports = router;