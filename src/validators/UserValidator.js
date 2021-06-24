const { checkSchema } = require("express-validator");

module.exports = {
  editAction: checkSchema({
    token: {
      notEmpty: true,
    },
    name: {
      optional: true,
      trim: true,
      notEmpty: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Nome precisa ter no mínimo 2 aracteres.",
    },
    email: {
      optional: true,
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "E-mail invalido",
    },
    password: {
      optional: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Senha precisa ter no mínimo 2 aracteres.",
    },
    state: {
      optional: true,
      notEmpty: true,
      errorMessage: "Estado não preenchido.",
    },
  }),
};
