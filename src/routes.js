const express = require("express");
const userController = require("/controllers/userController");
const { connection } = require("./config/database");

const routes = express();

routes.post("/addWallet", userController.addWallet);

routes.get("/getWallet", userController.getWallet);

routes.delete("/wallets/:id", userController.deleteWallet);

routes.post("/addCategory", userController.addCategory);

routes.get("/getCategory", userController.getCategory);

routes.delete("/categories/:id", userController.deleteCategory);

routes.post("/addTransaction", userController.addTransaction);

routes.get("/getTransaction", userController.getTransaction);

routes.delete("/transactions/:id", userController.deleteTransaction);

module.exports = routes;