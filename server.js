const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware untuk parsing JSON body

const databasePath = './database.json';

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', (req, res) => {
  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const products = JSON.parse(data);
    res.json(products);
  });
});

// Endpoint untuk menambah produk baru
app.post('/api/products', (req, res) => {
  const newProduct = req.body;

  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const products = JSON.parse(data);
    newProduct.id = products.length + 1; // Generate ID sederhana

    products.push(newProduct);

    fs.writeFile(databasePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(201).json(newProduct);
    });
  });
});

// Endpoint untuk memperbarui produk
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    fs.writeFile(databasePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(products[productIndex]);
    });
  });
});

// Endpoint untuk menghapus produk
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let products = JSON.parse(data);
    const updatedProducts = products.filter(p => p.id !== productId);

    if (products.length === updatedProducts.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    fs.writeFile(databasePath, JSON.stringify(updatedProducts, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
