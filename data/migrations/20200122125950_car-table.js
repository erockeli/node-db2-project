exports.up = function(knex) {
    return knex.schema.createTable("cars", tbl => {
    
      tbl.increments("carId");
  
      
      tbl
        .string("vin", 17)
        .unique()
        .notNullable();
      tbl.string("make").notNullable();
      tbl.string("model").notNullable();
      tbl.integer("year").notNullable();
      tbl.integer("mileage").notNullable();
  
    
      tbl.string("transmission").nullable();
      tbl.string("title").nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("cars");
  };