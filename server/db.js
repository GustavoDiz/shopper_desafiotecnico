async function connect() {
  const mysql = require("mysql2/promise");
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ufDolyeYrnGT366",
    database: "productsdb",
  });

  con.connect();
  return con;
}

//APAGAR DEPOIS ISSO É APENAS PARA UM TESTE
async function showProducts() {
  try {
    const conn = await connect();
    const result = await conn.query("SELECT * FROM products;");
    return result[0];
  } catch (error) {
    throw error;
  }
}

//ATUALIZAR VALOR DO PRODUTO
async function updatePrices(products) {
  const conn = await connect();
  try {
    for (const product of products) {
      const { product_code, new_price } = product;
      await conn.query("UPDATE products SET sales_price = ? WHERE code = ?", [
        new_price,
        product_code,
      ]);
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
                new_price <= oldPriceValue - tenPercent ||
                new_price >= oldPriceValue + tenPercent
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

module.exports = { showProducts, updatePrices, validateUpdate };
