//function to show a modal by setting its display to "block"
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
};

//function to close a modal by setting its display to "none"
function closeModal(modalId) {
document.getElementById(modalId).style.display = "none";
};

//EventListener to display the "Add Transaction" modal when the button in clicked
document.getElementById("addTransactionBtn").addEventListener("click", function () {
    showModal("addTransactionModal");
});


function populateDropdown(endpoint, dropdownId, placeholderText = "Select an option") {
  fetch(endpoint)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          const dropdown = document.getElementById(dropdownId);
          dropdown.innerHTML = ""; // Clear previous options

          if (data.length === 0) {
              // If no items, show a placeholder option
              const placeholderOption = document.createElement("option");
              placeholderOption.textContent = placeholderText;
              placeholderOption.disabled = true;
              placeholderOption.selected = true;
              dropdown.appendChild(placeholderOption);
          } else {
              // Populate the dropdown with options
              data.forEach((item) => {
                  const option = document.createElement("option");
                  option.value = item.category_id || item.wallet_id; // Dynamically handle IDs
                  option.textContent = item.category_name || item.wallet_name; // Dynamically handle names
                  dropdown.appendChild(option);
              });
          }
      })
      .catch((error) => {
          console.error(`Error fetching data from ${endpoint}:`, error);
          alert(`Failed to fetch data. Please try again later.`);
      });
}

document.addEventListener("DOMContentLoaded", () => {
  //populate the wallet dropdown
  populateDropdown("/getWallet", "walletDropdown", "No wallets avilable");

  //Populate the categories dropdown
  populateDropdown("/getCategory", "categoriesDropdown", "No categories available");
})

function fetchAndDisplayTransactions() {
  let totalAmount = 0; // Initialize total

  // Fetch wallet data
  fetch('/getWallet')
      .then(walletResponse => walletResponse.json())
      .then(wallets => {
          console.log("Wallets fetched:", wallets); // Debugging

          // Sum up all wallets' initial balances
          wallets.forEach(wallet => {
              const walletBalance = parseFloat(wallet.initial_balance) || 0; // Ensure it's a number
              totalAmount += walletBalance;
              console.log(`Wallet ID: ${wallet.wallet_id}, Initial Balance: ${walletBalance}, Running Total: ${totalAmount}`); // Debugging
          });

          // Fetch transaction data
          fetch('/getTransaction')
              .then(transactionResponse => transactionResponse.json())
              .then(transactions => {
                  console.log("Transactions fetched:", transactions); // Debugging
                  const tableBody = document.getElementById("transactionTableBody");
                  tableBody.innerHTML = ""; // Clear existing rows

                  // Add transactions to the table and update the total
                  transactions.forEach(transaction => {
                      const row = document.createElement("tr");

                      const transactionAmount = parseFloat(transaction.amount) || 0; // Ensure it's a number
                      if (transaction.type === "Income") {
                          totalAmount += transactionAmount;
                      } else if (transaction.type === "Expense") {
                          totalAmount -= transactionAmount;
                      }

                      // Add transaction row to the table
                      row.innerHTML = `
                          <td>${new Date(transaction.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                          })}</td>
                          <td>${transaction.type}</td>
                          <td>${transaction.Wallet}</td>
                          <td>${transaction.Category}</td>
                          <td>${transaction.description}</td>
                          <td>${transactionAmount.toFixed(2)}</td>
                          <td>
                              <button class="button delete-btn" data-id="${transaction.transaction_id}">Delete</button>
                              <button class="button edit-btn" data-id="${transaction.transaction_id}">Edit</button>
                          </td>
                      `;
                      tableBody.appendChild(row);
                  });

                  // Add a row for the total
                  const totalRow = document.createElement("tr");
                  totalRow.innerHTML = `
                      <td colspan="5" style="font-weight: bold; text-align: right;">Total</td>
                      <td style="font-weight: bold;">${totalAmount.toFixed(2)}</td>
                  `;
                  tableBody.appendChild(totalRow);
              })
              .catch(err => {
                  console.error("Error fetching transactions:", err);
              });
      })
      .catch(err => {
          console.error("Error fetching wallets:", err);
      });
}


// Attach event listeners dynamically using delegation
document.addEventListener("click", (event) => {
    // Handle "Delete" button click to open the delete modal
    if (event.target.classList.contains("delete-btn")) {
        const transactionID = event.target.getAttribute("data-id");
        showModal("deleteTransactionModal");

        // Set the transaction ID on the confirm delete button
        const deleteConfirmButton = document.querySelector("#deleteTransactionModal .delButton");
        deleteConfirmButton.setAttribute("data-id", transactionID);
    }

    // Handle "Yes" button click inside the delete modal to delete the transaction
    if (event.target.classList.contains("delButton")) {
        const transactionID = event.target.getAttribute("data-id");

        // Sends a DELETE request to remove a transaction
        fetch(`/transactions/${transactionID}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (response.ok) {
                closeModal("deleteTransactionModal");
                fetchAndDisplayTransactions();
                console.log("Transaction deleted successfully");
            } else {
                console.error("Failed to delete transaction");
            }
        })
        .catch((error) =>
            console.error("Error deleting transaction:", error),
        );
    }
  });

  // Attach event listeners dynamically using delegation
document.addEventListener("click", (event) => {
    // Handle "Edit" button click to open the delete modal
    if (event.target.classList.contains("edit-btn")) {
        const transactionID = event.target.getAttribute("data-id");
        showModal("editTransactionModal");

        // Set the transaction ID on the confirm delete button
        const editSaveButton = document.querySelector("#editTransactionModal .editButton");
        editSaveButton.setAttribute("data-id", transactionID);
    }

    // Handle "Yes" button click inside the delete modal to delete the transaction
    if (event.target.classList.contains("editButton")) {
        const transactionID = event.target.getAttribute("data-id");

        // Sends a DELETE request to remove a transaction
        fetch(`/transactions/${transactionID}`, {
            method: "EDIT",
        })
        .then((response) => {
            if (response.ok) {
                closeModal("editTransactionModal");
                fetchAndDisplayTransactions();
                console.log("Transaction edited successfully");
            } else {
                console.error("Failed to edit transaction");
            }
        })
        .catch((error) =>
            console.error("Error editing transaction:", error),
        );
    }
  });

  // Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayTransactions);
