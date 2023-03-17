
// Wait until the page loads
window.addEventListener("load", function() {

    // Check if user clicks the back button
    let buttonScoresBackContainer = document.getElementById("scores-back-button-container");
    let buttonScoresBack = document.getElementById("scores-back-button"); // Back button not clicked
    let buttonScoresBackClicked = document.getElementById("scores-back-button-clicked"); // Back button clicked
    let buttonScoresBackText = document.getElementById("scores-back-button-text");
    buttonScoresBackContainer.addEventListener("click", function() {
        // Animate button
        buttonScoresBack.style.display = "none";
        buttonScoresBackClicked.style.display = "initial";
        buttonScoresBackText.style.marginTop = "-1%";
        // After 120 ms
        setTimeout(function() {
            buttonScoresBack.style.display = "initial"; // Display the "unclicked" button image
            buttonScoresBackClicked.style.display = "none"; // Hide the "clicked" button image
            buttonScoresBackText.style.marginTop = "0%"; // Move the text to the initial position
        }, 120);
    });

});