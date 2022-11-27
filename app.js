const Container = require("./Container");

const PATH = "./productos.txt";
const PORT = 8080;

var express = require("express");
var app = express();

const container = new Container(PATH);


app.get("/", function (req, res) {
  res.send('<h1 style="color:red;"> Home page </h1>');
});

app.get("/productoRandom", function (req, res) {
  async function getRandom() {
    let randomId = container.getRandomInt(1, container.getLength());

    let randomProduct = await container.getById(randomId);

    res.send(randomProduct);
  }
  getRandom();
});

app.get("/productos", function (req, res) {
  async function getProducts() {
    let products = await container.getAll();

    res.send(products);
  }
  getProducts();
});

app.listen(PORT, function () {
  console.log(`escuchando el puerto ${PORT}`);
});
