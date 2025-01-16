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