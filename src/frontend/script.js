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

//EventListener to display the "Add Wallet" modal when the button in clicked
document.getElementById("addWalletBtn").addEventListener("click", function () {
    showModal("addWalletModal");
});

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