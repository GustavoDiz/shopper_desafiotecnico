const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/updateprices", async (req, res) => {
  try {
    const products = req.body.products;
    await db.updatePrices(products);
    res.json({ sucess: true });
  } catch (error) {
    res.status(500);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await db.showProducts();
    res.json(products);
  } catch (error) {
    res.status(500);
  }
});

router.post("/validate", async (req, res) => {
  try {
    const products = req.body.products;
    const response = await db.validateUpdate(products);
    res.json(response);
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
