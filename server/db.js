require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

async function connect() {
  const mysql = require("mysql2/promise");
  const con = await mysql.createConnection(dbConfig);
  con.connect();
  return con;
}

//ATUALIZAR VALOR DO PRODUTO
async function updatePrices(products) {
  const conn = await connect();
  try {
    for (const product of products) {
      const { product_code, new_price } = product;
      const existPack = await conn.query(
        "SELECT IF(EXISTS(SELECT * FROM packs WHERE pack_id = ?),'true','false') AS result",
        [product_code]
      );
      if (existPack[0][0].result == "true") {
        
        const productPack = await conn.query(
          "SELECT product_id, qty FROM packs WHERE pack_id = ?",
          [product_code]
        );
        const productId = productPack[0][0].product_id;
        const quantity = productPack[0][0].qty;
        const individualPrice = new_price / quantity;
        await conn.query("UPDATE products SET sales_price = ? WHERE code = ?", [
          new_price,
          product_code,
        ]);
        await conn.query("UPDATE products SET sales_price = ? WHERE code = ?", [
          [individualPrice],
          [productId],
        ]);
      } else {
        await conn.query("UPDATE products SET sales_price = ? WHERE code = ?", [
          new_price,
          product_code,
        ]);
      }
    }
    return products;
  } catch (error) {
    throw error;
  }
}

async function validateUpdate(products) {
  const productsChecked = [];
  const conn = await connect();
  try {
    for (const product of products) {
      const { product_code, new_price } = product;
      const erro = {
        code: 0,
        name: "",
        actual_price: "",
        new_price: new_price,
        errorType: "",
      };

      if (product_code.trim() && new_price.trim()) {
        const exist = await conn.query(
          "SELECT IF(EXISTS(SELECT * FROM products WHERE code = ?),'true','false') AS result",
          [product_code]
        );

        if (exist[0][0].result != "true") {
          erro.code = product_code;
          erro.errorType = 2;
          productsChecked.push(erro);
        } else {
          const product = await conn.query(
            "SELECT name,sales_price FROM products WHERE code = ?",
            [product_code],
            function (err, results) {
              if (err) throw err;
              return results;
            }
          );

          const productValues = product[0][0];
          erro.name = productValues.name;
          erro.actual_price = productValues.sales_price;
          var oldPrice = await conn.query(
            "SELECT sales_price FROM products WHERE code = ?",
            [product_code]
          );
          var oldPriceValue = oldPrice[0][0].sales_price;
          const tenPercent = oldPriceValue * 0.1;
          const costPrice = await conn.query(
            "SELECT cost_price FROM products WHERE code = ?",
            [product_code]
          );
          if (!isNaN(new_price)) {
            var costPriceValue = parseFloat(costPrice[0][0].cost_price);
            if (new_price > costPriceValue) {
              if (
                new_price <= parseFloat(oldPriceValue) - tenPercent ||
                new_price >= parseFloat(oldPriceValue) + parseFloat(tenPercent)
              ) {
                erro.code = product_code;
                erro.errorType = 5;
              } else {
                erro.code = product_code;
                erro.errorType = 0;
              }
              productsChecked.push(erro);
            } else {
              erro.code = product_code;
              erro.errorType = 4;
              productsChecked.push(erro);
            }
          } else {
            erro.code = product_code;
            erro.errorType = 3;
            productsChecked.push(erro);
          }
        }
      } else {
        erro.code = product_code;
        erro.errorType = 1;
        productsChecked.push(erro);
      }
    }
    return productsChecked;
  } catch (e) {
    throw e;
  }
}

module.exports = { updatePrices, validateUpdate };
