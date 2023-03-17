
// Wait until the page loads
window.addEventListener("load", function() {

    // Check if user clicks the register button
    let buttonRegisterForm = document.getElementById("register-form-button");
    let buttonRegister = document.getElementById("register-button"); // Register button not clicked
    let buttonRegisterClicked = document.getElementById("register-button-clicked"); // Register button clicked
    let buttonRegisterText = document.getElementById("register-button-text");
    buttonRegisterForm.addEventListener("click", function() {
        // Animate button
        buttonRegister.style.display = "none";
        buttonRegisterClicked.style.display = "initial";
        buttonRegisterText.style.marginTop = "-1%";
        // After 120 ms
        setTimeout(function() {
            buttonRegister.style.display = "initial"; // Display the "unclicked" button image
            buttonRegisterClicked.style.display = "none"; // Hide the "clicked" button image
            buttonRegisterText.style.marginTop = "0%"; // Move the text to the initial position
        }, 120);
    });

});