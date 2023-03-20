
// Wait until the page loads
window.addEventListener("load", function() {

    // Check if user clicks the back button
    let buttonCreditsUnregisteredBackForm = document.getElementById("scores-credits-unregistered-back-form-button");
    let buttonCreditsUnregisteredBack = document.getElementById("scores-credits-unregistered-back-button"); // Back button not clicked
    let buttonCreditsUnregisteredBackClicked = document.getElementById("scores-credits-unregistered-back-button-clicked"); // Back button clicked
    let buttonCreditsUnregisteredBackText = document.getElementById("scores-credits-unregistered-back-button-text");
    buttonCreditsUnregisteredBackForm.addEventListener("click", function() {
        // Animate button
        buttonCreditsUnregisteredBack.style.display = "none";
        buttonCreditsUnregisteredBackClicked.style.display = "initial";
        buttonCreditsUnregisteredBackText.style.marginTop = "-1%";
        // After 120 ms
        setTimeout(function() {
            buttonCreditsUnregisteredBack.style.display = "initial"; // Display the "unclicked" button image
            buttonCreditsUnregisteredBackClicked.style.display = "none"; // Hide the "clicked" button image
            buttonCreditsUnregisteredBackText.style.marginTop = "0%"; // Move the text to the initial position
        }, 120);
    });
});