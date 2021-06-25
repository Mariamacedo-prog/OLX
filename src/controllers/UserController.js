const { validationResult, matchedData } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const State = require("../models/State");
const Ad = require("../models/Ad");
const User = require("../models/User");
const Category = require("../models/Category");

module.exports = {
  getState: async (req, res) => {
    let states = await State.find();
    res.json({
      states: states,
    });
  },
  info: async (req, res) => {
    let token = req.query.token;

    const user = await User.findOne({ token });
    const state = await State.findById(user.state);
    const ads = await Ad.find({ idUser: user._id.toString() });

    let adList = [];

    for (let i in ads) {
      const cat = await Category.findById(ads[i].category);
      /*
      PODE SER DESTA FORMA:
      adList.push({
        id: ads[i]._id,
        status: ads[i].status,
        images: ads[i].images,
        dateCreated: ads[i].dateCreated,
        title: ads[i].title,
        price: ads[i].price,
        priceNegotiable: ads[i].priceNegotiable,
        views: ads[i].views,
        viedescriptionws: ads[i].description,
        category: cat.slug,
      });
      OU DESSA:
      */
      adList.push({ ...ads[i], category: cat.slug });
    }

    res.json({
      name: user.name,
      email: user.email,
      state: state.name,
      ads: adList,
    });
  },
  editAction: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    const data = matchedData(req);

    let updates = {};

    if (data.name) {
      updates.name = data.name;
    }

    if (data.email) {
      const checkEmail = await User.findOne({ email: data.email });
      if (checkEmail) {
        res.json({ error: "E-mail já existe" });
        return;
      }

      updates.email = data.email;
    }

    if (data.state) {
      if (mongoose.Types.ObjectId.isValid(data.state)) {
        const checkState = await State.findById(data.state);
        if (!checkState) {
          res.json({ error: "Estado não existe." });
          return;
        }
        updates.state = data.state;
      } else {
        res.json({ error: "Códigod de estado inválido." });
        return;
      }
    }

    if (data.password) {
      updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await User.findOneAndUpdate({ token: data.token, $set: updates });

    res.json({});
  },
};
