'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id');
    table.string('user_email').unique().notNullable().defaultTo('');
    table.specificType('user_hashed_password', 'char(60)').notNullable();
    table.string('user_access').notNullable().defaultTo('');
    table.string('user_reset_password_token').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
