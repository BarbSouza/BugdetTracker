const path = require("path");
const { connection } = require("../config/database");


const form = (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  };
  

const addWallet = (req, res) => {
    const { walletName, initialBalance } = req.body;

    const query = "INSERT INTO Wallets (wallet_name, initial_balance) VALUES (?, ?)";
    connection.query(query, [walletName, initialBalance], (err) => {
        if (err) {
            console.error("Error adding wallet:", err);
            return res.status(500).send("Error adding wallet");
        }
        res.sendFile(path.join(__dirname, "../frontend/wallets.html"))
    });
};

const addCategory = (req, res) => {
    const { categoryName } = req.body;

    const query = "INSERT INTO Categories (category_name) VALUES (?)";
    connection.query(query, [categoryName], (err) => {
        if (err) {
            console.error("Error adding category:", err);
            return res.status(500).send("Error adding category");
        }
        
        res.sendFile(path.join(__dirname, "../frontend/categories.html"));

    });
};

const addTransaction = (req, res) => {
    const { date, type, wallet_id, category_id, description, amount} = req.body;

    const query = "INSERT INTO transactions (date, type, wallet_id, category_id, description, amount) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(query, [date, type, wallet_id, category_id, description, amount], (err) => {
        if (err) {
            console.error("Error inserting transaction:", err);
        }
        res.sendFile(path.join(__dirname, "../frontend/transactions.html"));
    });

};

const getTransactions = (req, res) => {
    const query = `SELECT t.transaction_id, t.date, t.type, w.wallet_name AS Wallet, c.category_name AS Category, t.description, t.amount
    FROM Transactions t
    LEFT JOIN Wallets w ON t.wallet_id = w.wallet_id
    LEFT JOIN Categories c ON t.category_id = c.category_id`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching transactions", err);
            res.status(500).send("Error fetching transactions");
        } else {
            console.log("Fetched Transactions:", results);
            res.json(results);
        }
    });
};

const deleteTransaction = (req, res) => {
    const transactionID = req.params.id;
    const query = `DELETE FROM Transactions WHERE transaction_id = ?`;
    connection.query(query, [transactionId], (err, result) => {
        if (err){
            console.error("Error deleting transaction:", err);
            res.status(500).send("Error deleting transaction");
        } else {
            res.status(200).send("Transaction deleted successfully");
        }
    });

};

const getWallets = (req, res) => {
    const query = "SELECT wallet_id, wallet_name FROM Wallets";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching wallets:", err);
            return res.status(500).send("Erros fecthing wallets");
        } else {
            res.json(results);
        }
    });
};

const getCategories = (req, res) => {
    const query = "SELECT category_id, category_name FROM Categories";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).send("Erros fecthing categories");
        } else {
            res.json(results);
        }
    });
};

const deleteWallet = (req, res) => {
    const walletID = req.params.id;
    const query = `DELETE FROM Wallets WHERE wallet_id = ?`;
    connection.query(query, [transactionId], (err, result) => {
        if (err){
            console.error("Error deleting wallet:", err);
            res.status(500).send("Error deleting wallet");
        } else {
            res.status(200).send("Wallet deleted successfully");
        }
    });
};

const deleteCategory = (req, res) => {
    const categoryID = req.params.id;
    const query = `DELETE FROM Categories WHERE category_id = ?`;
    connection.query(query, [transactionId], (err, result) => {
        if (err){
            console.error("Error deleting category:", err);
            res.status(500).send("Error deleting category");
        } else {
            res.status(200).send("Category deleted successfully");
        }
    });
};

module.exports = {
    form,
    addTransaction,
    getTransactions,
    deleteTransaction,
    addWallet,
    addCategory,
    getCategories,
    getWallets,
    deleteWallet,
    deleteCategory
};
