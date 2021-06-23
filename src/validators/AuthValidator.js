const { checkSchema } = require("express-validator");

module.exports = {
  singup: checkSchema({
    name: {
      trim: true,
      notEmpty: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Nome precisa ter no mínimo 2 aracteres.",
    },
    email: {
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "E-mail invalido",
    },
    password: {
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Senha precisa ter no mínimo 2 aracteres.",
    },
    state: {
      notEmpty: true,
      errorMessage: "Estado não preenchido.",
    },
  }),
};
