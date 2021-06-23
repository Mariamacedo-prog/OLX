const { validationResult, matchedData } = require("express-validator");

module.exports = {
  singin: async (req, res) => {},
  singup: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }

    const data = matchedData(req);

    res.json({ tudocerto: true, data });
  },
};
