const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

const app = express();
app.use(formidable());

//création d'une nouvelle annonce
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    //Destructuring
    const { title, description, price, condition, city, brand, size, color } =
      req.fields;

    //Déclarer newOffer
    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        { MARQUE: brand },
        { TAILLE: size },
        { ÉTAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ],
      owner: req.user,
    });
    //Uploader l'image
    const result = await cloudinary.uploader.upload(req.files.picture.path, {
      folder: `/vinted/offer/${newOffer._id},`,
    });
    // Ajouter le resultat de l'upload dans newOffer
    newOffer.product_image = result;
    // Sauvgarder newOffer
    await newOffer.save();
    res.json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Création d'une route offer avec pagination et trie

router.get("/offers", async (req, res) => {
  try {
    const { title, description, price, size, color, condition, city, page } =
      req.query;

    let filters = {};

    if (title) {
      filters.product_name = new RegExp(title, "i").select(
        "product_name product_price"
      );
    }
    if (description) {
      filters.product_name = { $gte };
    }
    if (price) {
      filters.product_price = price;
    }
    if (size) {
      filters.product_name = size;
    }
    if (color) {
      filters.product_name = color;
    }
    if (condition) {
      filters.product_name = condition;
    }
    if (city) {
      filters.product_name = city;
    }
    if (page) {
      filters.product_name = page;
    }
    // const filterOffer = await Offer.find({
    //   product_name: new RegExp(title, "i"),}).select("product_name product_price");//
    // etc
    // puis plus bas
    let results = await Offer.find(filters); // .sort..... etc
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
