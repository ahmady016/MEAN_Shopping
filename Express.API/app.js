// requiring packages
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFile = require('jsonfile');
const uuid = require('uuid/v1');
const bcrypt = require('bcrypt-nodejs');

// get the http server
const app = express();
// start the http server on http://localhost:7000;
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`server running at ${port} port`));

// setting bobyParser Middleware [application/json] parser
app.use(bodyParser.json());
// setting bobyParser Middleware [application/x-www-form-urlencoded] parser
app.use(bodyParser.urlencoded({ extended: false }));

// allow CORS
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'ALLOWALL');
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// db path
const dbPath = './_db';
// getAll return array of objects of a given directory json files
const getAll = (dir) => fs.readdirSync(dir)
                          .map(filePath => jsonFile.readFileSync(`${dir}${filePath}`));

//#region Products Actions

// list all products
app.get('/products', (req, res) => {
  let products = getAll(`${dbPath}/products/`);
  res.send(products);
});
// get a product by id
app.get('/products/:id', (req, res) => {
  jsonFile.readFile(`${dbPath}/products/${req.params.id}.json`, (err, product) => {
    if(err)
      console.error(err);
    res.send(product);
  });
});
// add new product
app.post('/products', (req, res) => {
  let product = req.body;
  const newId = uuid();
  product.id = newId;
  jsonFile.writeFile(`${dbPath}/products/${newId}.json`, product, (err) => {
    if(err)
      console.error(err);
    res.send(product);
  });
});
// update existing product
app.put('/products/:id', (req, res) => {
  let updatedProduct = req.body;
  jsonFile.writeFile(`${dbPath}/products/${req.params.id}.json`, updatedProduct, (err) => {
    if(err)
      console.error(err);
    res.send(updatedProduct);
  });
});
// delete existing product
app.delete('/products/:id', (req, res) => {
  fs.unlinkSync(`${dbPath}/products/${req.params.id}.json`);
  res.send( {deletedProductId: req.params.id } );
});

//#endregion

//#region Customers Actions

// add new customer
const addNewCustomer = (customer) => {
  const newCustomerId = uuid();
  customer.id = newCustomerId;
  customer.password = bcrypt.hashSync(customer.password);
  jsonFile.writeFileSync(`${dbPath}/customers/${newCustomerId}.json`, customer);
  return newCustomerId;
}

// customer SignUp
app.post('/customers', (req, res) => {
  let customer = req.body;
  addNewCustomer(customer);
  res.send(customer);
});

//customer SignIn
app.get('/customers/:email/:password', (req, res) => {
  let customers = getAll(`${dbPath}/customers/`);
  let customer = customers.find(customer =>
                                customer.email === req.params.email &&
                                bcrypt.compareSync(req.params.password, customer.password)
                               )
  res.send(customer);
});

// update existing customer
app.put('/customers/:id', (req, res) => {
  let updatedCustomer = req.body;
  jsonFile.writeFile(`${dbPath}/customers/${req.params.id}.json`, updatedCustomer, (err) => {
    if(err)
      console.error(err);
    res.send(updatedCustomer);
  });
});

//#endregion

//#region Orders Actions

// add new order
const addNewOrder = (order, customerId) => {
  delete order.customer;
  const newOrderId = uuid();
  order.id = newOrderId;
  order.customerId = customerId;
  order.createdAt = new Date();
  jsonFile.writeFileSync(`${dbPath}/orders/${newOrderId}.json`, order);
}

// add new customer and order OR new order only
app.post('/orders', (req, res) => {
  let order = req.body;

  if(!order.customer)
    return res.sendStatus(400).json({
      error: 'Missing Order Customer!!!'
    });

  if(typeof order.customer == 'object')
    addNewOrder(order, addNewCustomer(order.customer));
  else if (typeof order.customer == 'string')
    addNewOrder(order, order.customer);

  res.send(order);
});
// list all orders of a given customer
app.get('/orders/:customerId', (req, res) => {
  let orders = getAll(`${dbPath}/orders/`);
  let customerOrders = orders.filter( order => order.customerId === req.params.customerId)
  res.send(customerOrders);
});

//#endregion