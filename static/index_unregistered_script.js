
// Wait until the page loads
window.addEventListener("load", function() {

    // Check if user clicks the back button
    let buttonIndexBackContainer = document.getElementById("index-back-button-container");
    let buttonIndexBack = document.getElementById("index-back-button"); // Back button not clicked
    let buttonIndexBackClicked = document.getElementById("index-back-button-clicked"); // Back button clicked
    let buttonIndexBackText = document.getElementById("index-back-button-text");
    buttonIndexBackContainer.addEventListener("click", function() {
        // Animate button
        buttonIndexBack.style.display = "none";
        buttonIndexBackClicked.style.display = "initial";
        buttonIndexBackText.style.marginTop = "-1%";
        // After 120 ms
        setTimeout(function() {
            buttonIndexBack.style.display = "initial"; // Display the "unclicked" button image
            buttonIndexBackClicked.style.display = "none"; // Hide the "clicked" button image
            buttonIndexBackText.style.marginTop = "0%"; // Move the text to the initial position
        }, 120);
    });
});