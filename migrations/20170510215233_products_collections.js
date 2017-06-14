'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('products_collections', (table) => {
    table.increments('id').primary();
    table.integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')
      .index();
    table.integer('collection_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('collections')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products_collections');
};
