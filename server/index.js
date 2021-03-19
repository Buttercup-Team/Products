const express = require('express');

const app = express();
const port = 3000;
const path = require('path');
const db = require('./db.js');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

app.use(express.static(PUBLIC_DIR));
app.use(express.json());

app.get('/product/:params', (req, res) => {
  const { params } = req.params;
  const queryStr = `select * from products where id = ${params};
                    select feature, value from features where product_id = ${params}`;
  db.query(queryStr, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    const resObj = results[0].rows;
    resObj[0].features = results[1].rows;
    res.send(resObj[0]);
  });
});

app.get('/styles/:params', (req, res) => {
  const { params } = req.params;
  const queryStr1 = `select * from styles where productId = ${params}`;

  db.query(queryStr1)
    .then((results) => {
      const promiseArr = [];
      results.rows.map((style) => {
        const queryStr = `select id, size, quantity from skus where styleId = ${style.id};
                            select url, thumbnail_url from photos where styleId = ${style.id}`;
        const promise = db
          .query(queryStr)
          .then((results) => {
            style.photos = results[1].rows;
            style.skus = {};
            results[0].rows.map((sku) => {
              const skuId = sku.id;
              style.skus[skuId] = {
                size: sku.size,
                quantity: sku.quantity,
              };
            });
            return style;
          })
          .catch((err) => console.log(err));
        return promiseArr.push(promise);
      });
      return Promise.all(promiseArr);
    })
    .then((styles) => res.send(styles))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
