const uuid = require("uuid");
const jimp = require("jimp");

const Category = require("../models/Category");
const User = require("../models/User");
const Ad = require("../models/Ad");

const addImage = async (buffer) => {
  let newName = `${uuid.v4()}.jpg`;
  let tmpImage = await jimp.read(buffer);
  tmpImage.cover(500, 500).quality(80).write(`/public/media/${newName}`);
  return newName;
};

module.exports = {
  getCategories: async (req, res) => {
    const cats = await Category.find();

    let categories = [];

    for (let i in cats) {
      categories.push({
        ...cats[i]._doc,
        img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`,
      });
    }

    res.json({ categories });
  },
  addAction: async (req, res) => {
    let { title, cat, token, price, priceneg, desc } = req.body;
    const user = await User.findOne({ token }).exec();

    if (!title || !cat) {
      res.json({ error: "Titulo e/ou categoria não preenchidos." });
      return;
    }

    if (price) {
      //R$ 8.000,65   8000.65
      price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
      price = parseFloat(price);
    } else {
      price = 0;
    }

    const newAd = new Ad();
    newAd.status = true;
    newAd.idUser = user._id;
    newAd.state = user.state;
    newAd.dateCreated = new Date();
    newAd.title = title;
    newAd.category = cat;
    newAd.price = price;
    newAd.description = desc;
    newAd.views = 0;
    newAd.priceNegotiable = priceneg == "true" ? true : false;

    const info = await newAd.save();

    res.json({ id: info._id });
  },
  getList: async (req, res) => {},
  getItem: async (req, res) => {},
  editAction: async (req, res) => {},
};
