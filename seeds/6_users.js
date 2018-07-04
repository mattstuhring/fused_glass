'use strict';

exports.seed = function(knex) {
  return knex('users').del()
  .then(() => knex('users').insert([
    {
      user_id: 1,
      user_email: 'test@test.com',
      user_hashed_password: '$2a$10$e9wOPCUIDk3LT9xw.Heii.zvP9PhV0CkES.kllKLw6x7rlkNAU7Da',
      user_access: 'admin',
      user_reset_password_token: '',
      created_at: new Date('2018-04-15 12:12:16 UTC'),
      updated_at: new Date('2018-04-15 12:12:16 UTC')
    }])
  )
  .then(() => knex.raw(
      "SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));"
    )
  );
};
