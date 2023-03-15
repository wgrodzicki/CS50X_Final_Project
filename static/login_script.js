
// Wait until the page loads
window.addEventListener("load", function() {

    // Check if user clicks the Login button
    let buttonLoginForm = document.getElementById("login-form-button");
    let buttonLogin = document.getElementById("login-button"); // Login button not clicked
    let buttonLoginClicked = document.getElementById("login-button-clicked"); // Login button clicked
    let buttonLoginText = document.getElementById("login-button-text");
    buttonLoginForm.addEventListener("click", function() {
        // Animate button
        buttonLogin.style.display = "none";
        buttonLoginClicked.style.display = "initial";
        buttonLoginText.style.top = "45%";
        // After 120 ms
        setTimeout(function() {
            buttonLogin.style.display = "initial"; // Display the "unclicked" button image
            buttonLoginClicked.style.display = "none"; // Hide the "clicked" button image
            buttonLoginText.style.top = "50%"; // Move the text to the initial position
        }, 120);
    });

});