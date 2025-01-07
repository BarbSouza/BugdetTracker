const express = require("express");
const userControllers = require("./controllers/userControllers");
const { connection } = require("./config/database");

const routes = express();

routes.post("/addWallet", userControllers.addWallet);

routes.get("/getWallet", userControllers.getWallet);

routes.delete("/wallets/:id", userControllers.deleteWallet);

routes.post("/addCategory", userControllers.addCategory);

routes.get("/getCategory", userControllers.getCategory);

routes.delete("/categories/:id", userControllers.deleteCategory);

routes.post("/addTransaction", userControllers.addTransaction);

routes.get("/getTransaction", userControllers.getTransaction);

routes.delete("/transactions/:id", userControllers.deleteTransaction);

module.exports = routes;