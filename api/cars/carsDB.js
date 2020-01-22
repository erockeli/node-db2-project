const knex = require("../../data/dbConfig");

module.exports = {
  get,
  getSaleWithCar,
  insert,
  update,
  remove
};

function get(carId) {
  if (carId) {
    //? SELECT * FROM cars WHERE carId = carId
    return knex
      .select("*")
      .from("cars")
      .where({ carId: carId })
      .first();
  } else {
    //? SELECT * FROM cars
    return knex.select("*").from("cars");
  }
}

//? SELECT * FROM cars INNER JOIN sales ON cars.carId = sales.carId WHERE cars.carId = carId
function getSaleWithCar(carId) {
  return knex
    .select("*")
    .from("cars")
    .innerJoin("sales", "cars.carId", "sales.carId")
    .where({ "cars.carId": carId });
}

//? INSERT INTO cars (vin, make, model, year, mileage, [transmission, title]) VALUES(...car)
function insert(car) {
  return knex("cars").insert(car, "carId");
}

//? UPDATE cars SET {...changes} WHERE carId = req.params.carId
function update(carId, changes) {
  return knex("cars")
    .where({ carId })
    .update(changes);
}

//? DELETE FROM cars WHERE carId = carId
function remove(carId) {
  return knex("cars")
    .where({ carId: carId })
    .del();
}