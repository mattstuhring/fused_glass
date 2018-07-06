'use strict';

const bcrypt = require('bcrypt-as-promised');

bcrypt.hash('fusedglassbyceleste JWT secret', 12)
  .then((hashed) => {
    console.log(hashed); // eslint-disable-line no-console
  });
