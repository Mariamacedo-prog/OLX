const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const State = require("../models/State");

module.exports = {
  singin: async (req, res) => {},
  singup: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    const data = matchedData(req);

    const user = await User.findOne({
      email: data.email,
    });
    if (user) {
      res.json({
        error: { email: { msg: "E-mail já existe!" } },
      });
      return;
    }

    if (mongoose.Types.ObjectId.isValid(data.state)) {
      const stateItem = await State.findById(data.state);
      if (!stateItem) {
        res.json({
          error: { state: { msg: "Estado não existe." } },
        });
        return;
      }
    } else {
      res.json({
        error: { state: { msg: "Codigo de estado invalido!" } },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    const newUser = new User({
      name: data.name,
      email: data.email,
      state: data.state,
      passwordHash,
      token,
    });
    await newUser.save();

    res.json({ token });
  },
};
