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

// Fetches wallets from the server and displays them in a dropdown
document.addEventListener("DOMContentLoaded", () => {
    fetch("/wallets")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((wallets) => {
        const walletDropdown = document.getElementById("walletDropdown");
        walletDropdown.innerHTML = ""; // Clear previous options
  
        if (wallets.length === 0) {
          // If no wallets, show a placeholder option
          const placeholderOption = document.createElement("option");
          placeholderOption.textContent = "No wallets available";
          placeholderOption.disabled = true;
          placeholderOption.selected = true;
          walletDropdown.appendChild(placeholderOption);
        } else {
          // Populate the dropdown with wallet options
          wallets.forEach((wallet) => {
            const option = document.createElement("option");
            option.value = wallet.wallet_id;
            option.textContent = wallet.wallet_name;
            walletDropdown.appendChild(option);
          });
        }
      })
      .catch((error) => console.error("Error fetching wallets:", error));
  });