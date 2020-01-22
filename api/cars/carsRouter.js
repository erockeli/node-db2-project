const router = require("express").Router();

const carsDB = require("./carsDB");

//* GET / - Returns all cars in inventory.
router.get("/", (req, res) => {
  carsDB
    .get()
    .then(cars => {
      if (cars.length > 0) {
        res.status(200).json(cars);
      } else {
        res.status(404).json({ message: "No cars found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting cars" });
    });
});

//* GET /:id - Returns car by ID.
router.get("/:id", (req, res) => {
  const id = req.params.id;
  carsDB
    .get(id)
    .then(car => {
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: "car not found with specified id" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting car" });
    });
});

//* GET /:id/sale - Returns sale information by car ID.
router.get("/:id/sale", (req, res) => {
  const id = req.params.id;
  carsDB
    .getSaleWithCar(id)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data[0]);
      } else {
        res
          .status(404)
          .json({
            message: "car or sale data not found with specified car id"
          });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting car & sale data" });
    });
});

//* POST / - Adds a new car.
router.post("/", validateCar, (req, res) => {
  const car = req.body;

  carsDB
    .insert(car)
    .then(ids => {
      carsDB
        .get(ids[0])
        .then(car => {
          //Send new car back to client
          res.status(201).json(car);
        })
        .catch(error => {
          res.status(500).json({
            message: "Error getting car"
          });
        });
    })
    .catch(error => {
      if (error.errno === 19) {
        res
          .status(400)
          .json({
            message: "Car with specific VIN already exists in inventory!"
          });
      } else {
        res.status(500).json({ message: "Error adding a car" });
      }
    });
});

//* PUT /:id - Update a car by ID.
router.put("/:id", validateCarId, validateCar, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  carsDB
    .update(id, changes)
    .then(count => {
      if (count > 0) {
        carsDB
          .get(id)
          .then(car => {
            //Send updated car back to client
            res.status(201).json(car);
          })
          .catch(error => {
            res.status(500).json({
              message: "Error getting car"
            });
          });
      } else {
        res.status(404).json({ message: "Car not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error updating car"
      });
    });
});

//* DELETE /:id - Delete a car by id.
router.delete("/:id", validateCarId, (req, res) => {
  const id = req.params.id;

  carsDB
    .remove(id)
    .then(count => {
      res.status(200).json({ message: `${count} record(s) removed` });
    })
    .catch(error => {
      res.status(500).json({
        message: "Error removing car"
      });
    });
});

//MIDDLEWARE
function validateCar(req, res, next) {
  const { vin, make, model, year, mileage } = req.body;

  if (vin && make && model && year && mileage) {
    next();
  } else {
    res
      .status(400)
      .json({
        message: "Please provide a VIN, make, model, year, and mileage of car"
      });
  }
}

function validateCarId(req, res, next) {
  const id = req.params.id;

  carsDB.get(id).then(car => {
    if (car) {
      next();
    } else {
      res.status(400).json({ message: "Invalid car ID" });
    }
  });
}

module.exports = router;