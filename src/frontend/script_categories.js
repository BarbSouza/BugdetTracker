//function to show a modal by setting its display to "block"
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
};

//function to close a modal by setting its display to "none"
function closeModal(modalId) {
document.getElementById(modalId).style.display = "none";
};

//EventListener to display the "Add Category" modal when the button in clicked
document.getElementById("addCategoryBtn").addEventListener("click", function () {
    showModal("addCategoryModal");
});

//Adds event listeners to all "edit" buttons to show the "Delete Transaction" modal dynamically
document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
        showModal("editTransactionModal");
    });
});

//Adds event listeners to all "delete" buttons to show the "Delete Transaction" modal dynamically
document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
        showModal("deleteTransactionModal");
    });
});

window.onload = () => {
    fetch("/getCategoriesTotals")
    .then((response) => response.json())
    .then((categories) => {
        const categoriesTableBody = document.getElementById("categoriesTableBody");
        categoriesTableBody.innerHTML = ""; // Clear existing rows
        
        let totalSum = 0; // Initialize the total sum of all wallets

        categories.forEach((category) => {
            const row = document.createElement("tr");

            // Create table cells
            const categoryNameCell = document.createElement("td");
            categoryNameCell.textContent = category.category_name;

            const totalAmountCell = document.createElement("td");
            totalAmountCell.textContent = `$${category.total_amount.toFixed(2)}`;

            const deleteCategoryCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("button", "delbutton");
            deleteButton.setAttribute("data-id", category.category_id); 

            //Adds event listeners to all "delete" buttons to show the "Delete Transaction" modal dynamically
                
            deleteButton.addEventListener("click", function () {
                showModal("deleteCategoryModal");

                const deleteConfirmButton = document.querySelector("#deleteCategoryModal .confirm-delete-btn");
                deleteConfirmButton.setAttribute("data-id", category.category_id);
            });

                const editCategoryCell = document.createElement("td");
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("button", "editButton");
                editButton.setAttribute("data-id", category.category_id); 

                //Adds event listeners to all "delete" buttons to show the "Delete Transaction" modal dynamically
                
                editButton.addEventListener("click", function () {
                        showModal("editCategoryModal");

                        const editConfirmButton = document.querySelector("#editCategoryModal .confirm-edit-btn");
                        editConfirmButton.setAttribute("data-id", category.category_id);

                });

                deleteCategoryCell.appendChild(deleteButton);
                editCategoryCell.appendChild(editButton);


            // Append cells to row
            row.appendChild(categoryNameCell);
            row.appendChild(totalAmountCell);
            row.appendChild(deleteCategoryCell);
            row.appendChild(editCategoryCell);

            // Append row to table body
            categoriesTableBody.appendChild(row);

            // Add to total sum
            totalSum += category.total_amount;
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

        categoriesTableBody.appendChild(totalRow);
    })
    .catch((err) => console.error("Error fetching categories with totals:", err));
}