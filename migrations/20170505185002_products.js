'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('name').defaultTo('');
    table.string('price').defaultTo('');
    table.string('description').defaultTo('');
    table.string('color').defaultTo('');
    table.string('size').defaultTo('');
    table.string('image').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
