const path = require("path");
const { connection } = require("../config/database");


const form = (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  };
  

const addWallet = (req, res) => {
    const { walletName } = req.body;

    const query = "INSERT INTO Wallets (wallet_name) VALUES (?)";
    connection.query(query, [walletName], (err) => {
        if (err) {
            console.error("Error adding wallet:", err);
            return res.status(500).send("Error adding wallet");
        }
        res.redirect("../frontend/wallets.html");
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
        
        res.redirect("../frontend/categories.html");

    });
};

const addTransaction = (req, res) => {
    const { date, type, wallet_id, category_id, description, amount} = req.body;

    const query = "INSERT INTO transactions (date, type, wallet_id, category_id, description, amount) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(query, [date, type, wallet_id, category_id, description, amount], (err) => {
        if (err) {
            console.error("Error inserting transaction:", err);
        }
        res.redirect("../frontend/transactions.html");
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
    connection.query(query, [transactionID], (err, result) => {
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
    connection.query(query, [walletID], (err, result) => {
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
    connection.query(query, [categoryID], (err, result) => {
        if (err){
            console.error("Error deleting category:", err);
            res.status(500).send("Error deleting category");
        } else {
            res.status(200).send("Category deleted successfully");
        }
    });
};

const getWalletsTotals = (req, res) => {
    const query = `
        SELECT 
            w.wallet_id, 
            w.wallet_name, 
            IFNULL(SUM(CASE 
                WHEN t.type = 'income' THEN t.amount 
                WHEN t.type = 'expense' THEN -t.amount 
                ELSE 0 
            END), 0) AS total_amount
        FROM 
            Wallets w
        LEFT JOIN 
            Transactions t 
        ON 
            w.wallet_id = t.wallet_id
        GROUP BY 
            w.wallet_id, w.wallet_name;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching wallets with totals:", err);
            return res.status(500).send("Error fetching wallets with totals");
        }
        res.json(results);
    });
};

const getCategoriesTotals = (req, res) => {
    const query = `
        SELECT 
            c.category_id, 
            c.category_name, 
            IFNULL(SUM(CASE 
                WHEN t.type = 'income' THEN t.amount 
                WHEN t.type = 'expense' THEN -t.amount 
                ELSE 0 
            END), 0) AS total_amount
        FROM 
            Categories c
        LEFT JOIN 
            Transactions t 
        ON 
            c.category_id = t.category_id
        GROUP BY 
            c.category_id, c.category_name;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching categories with totals:", err);
            return res.status(500).send("Error fetching categories with totals");
        }
        res.json(results);
    });
};

const editTransaction = (req, res) => {
    const transactionID = req.params.id;
    const { date, type, wallet_id, category_id, description, amount } = req.body;

    if (!amount || !type || !wallet_id || !category_id || !date) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const query = `
        UPDATE Transactions 
        SET date = ?, type = ?, wallet_id = ?, category_id = ?, description = ?, amount = ?
        WHERE transaction_id = ?
    `;

    connection.query(query, [date, type, wallet_id, category_id, description, amount, transactionID], (err, result) => {
        if (err) {
            console.error("Error updating transaction:", err);
            return res.status(500).json({ error: "Error updating transaction" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully!" });
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
    deleteCategory,
    getWalletsTotals,
    getCategoriesTotals,
    editTransaction
};
