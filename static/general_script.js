
// Wait until the page loads
window.addEventListener("load", function() {

    let buttonRegisterForm = document.getElementById("register-form-button");
    let buttonRegister = document.getElementById("button-register"); // Starting button not clicked
    let buttonRegisterClicked = document.getElementById("button-register-clicked"); // Starting button clicked
    let buttonRegisterText = document.getElementById("register-button-text");
    buttonRegisterForm.addEventListener("click", function() {
        buttonRegister.style.display = "none";
        buttonRegisterClicked.style.display = "initial";
        buttonRegisterText.style.top = "45%";
        setTimeout(function() {
            buttonRegister.style.display = "initial"; // Display the "unclicked" button image
            buttonRegisterClicked.style.display = "none"; // Hide the "clicked" button image
            buttonRegisterText.style.top = "50%"; // Move the text to the initial position
        }, 120);
    });

});