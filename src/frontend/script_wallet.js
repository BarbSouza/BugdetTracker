//function to show a modal by setting its display to "block"
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
};

//function to close a modal by setting its display to "none"
function closeModal(modalId) {
document.getElementById(modalId).style.display = "none";
};

//EventListener to display the "Add Wallet" modal when the button in clicked
document.getElementById("addWalletBtn").addEventListener("click", function () {
    showModal("addWalletModal");
});

//Adds event listeners to all "edit" buttons to show the "Delete Transaction" modal dynamically
document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
        showModal("editWalletModal");
    });
});


window.onload = () => {
    fetch("/getWalletsTotals")
        .then((response) => response.json())
        .then((wallets) => {
            const walletsTableBody = document.getElementById("walletsTableBody");
            walletsTableBody.innerHTML = ""; // Clear existing rows
            
            let totalSum = 0; // Initialize the total sum of all wallets

            wallets.forEach((wallet) => {
                const row = document.createElement("tr");

                // Create table cells
                const walletNameCell = document.createElement("td");
                walletNameCell.textContent = wallet.wallet_name;

                const totalAmountCell = document.createElement("td");
                totalAmountCell.textContent = `$${wallet.total_amount.toFixed(2)}`;

                const deleteWalletCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("button", "delbutton");
                deleteButton.setAttribute("data-id", wallet.wallet_id); 

                //Adds event listeners to all "delete" buttons to show the "Delete Transaction" modal dynamically
                
                deleteButton.addEventListener("click", function () {
                        showModal("deleteWalletModal");

                        const deleteConfirmButton = document.querySelector("#deleteWalletModal .confirm-delete-btn");
                        deleteConfirmButton.setAttribute("data-id", wallet.wallet_id);
                });

                deleteWalletCell.appendChild(deleteButton);

                // Append cells to row
                row.appendChild(walletNameCell);
                row.appendChild(totalAmountCell);
                row.appendChild(deleteWalletCell);

                // Append row to table body
                walletsTableBody.appendChild(row);

                // Add to total sum
                totalSum += wallet.total_amount;
            });

            // Add a row for the total sum
            const totalRow = document.createElement("tr");
            totalRow.classList.add("total-row"); // Optional: Style the total row differently

            const totalLabelCell = document.createElement("td");
            totalLabelCell.textContent = "Total";
            totalLabelCell.style.fontWeight = "bold"; // Optional: Emphasize the total label

            const totalSumCell = document.createElement("td");
            totalSumCell.textContent = `$${totalSum.toFixed(2)}`;
            totalSumCell.style.fontWeight = "bold"; // Optional: Emphasize the total amount

            totalRow.appendChild(totalLabelCell);
            totalRow.appendChild(totalSumCell);

            walletsTableBody.appendChild(totalRow);
        })
        .catch((err) => console.error("Error fetching wallets with totals:", err));
}