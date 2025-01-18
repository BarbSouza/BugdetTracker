const mysql = require("mysql2");
require("dotenv").config();

// Establishes a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true, // Allows multiple SQL statements in a single query
  });


  function initDB(){

    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) {
            console.error("Error creating database");
                throw err;
        } else {
            console.log("Database created");
        }

        connection.query(`USE ${process.env.DB_NAME}`, (err) => {
            if(err) {
                console.error("Error using the created DB");
                throw err;
            } else {
                console.log("Using the new Database");
            }
        });

        const createWalletTable = `CREATE TABLE IF NOT EXISTS Wallets (
            wallet_id INT AUTO_INCREMENT PRIMARY KEY,
            wallet_name VARCHAR(255) NOT NULL
        );`;

            connection.query(createWalletTable, function (err){
                if (err){
                    console.error("Error creating Wallets table");
                } else {
                    console.log("Wallets Table Created")
                }
            });

        const createCategoriesTable = `CREATE TABLE IF NOT EXISTS Categories (
            category_id INT AUTO_INCREMENT PRIMARY KEY,
            category_name VARCHAR(255) NOT NULL
        );`;

        connection.query(createCategoriesTable, function (err){
            if (err) {
                console.error("Error creating Categories table");
                throw err;
            } else {
                console.log("Categories Table Created")
            }
        });

        const createTransactionsTable = `CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            date DATE NOT NULL,
            type VARCHAR(255) NOT NULL,
            wallet_id INT NOT NULL,
            category_id INT NOT NULL,
            description VARCHAR (255),
            amount DOUBLE NOT NULL,
            FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
        );`;
        connection.query(createTransactionsTable, function(err){
            if (err){
                console.error("Error creating Transactions table");
            } else {
                console.log("Transaction Table Created");
            }
        });
    });
  };

  module.exports = { connection, initDB}