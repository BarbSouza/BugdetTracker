const express = require("express");
const userControllers = require("./controllers/userControllers");
const { connection } = require("./config/database");

const routes = express();

routes.get("/", userControllers.form);

routes.post("/addWallet", userControllers.addWallet);

routes.get("/getWallet", userControllers.getWallets);

routes.delete("/wallets/:id", userControllers.deleteWallet);

routes.post("/addCategory", userControllers.addCategory);

routes.get("/getCategory", userControllers.getCategories);

routes.delete("/categories/:id", userControllers.deleteCategory);

routes.post("/addTransaction", userControllers.addTransaction);

routes.get("/getTransaction", userControllers.getTransactions);

routes.delete("/transactions/:id", userControllers.deleteTransaction);

routes.get("/getWalletsTotals", userControllers.getWalletsTotals);

routes.get("/getCategoriesTotals", userControllers.getCategoriesTotals);

module.exports = routes;