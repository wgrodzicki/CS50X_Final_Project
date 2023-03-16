
// Wait until the page loads
window.addEventListener("load", function() {

    // Put all buttons in an array
    let buttons = [];
    buttons[0] = document.getElementById("score-button-container");
    buttons[1] = document.getElementById("score-button");
    buttons[2] = document.getElementById("score-button-clicked");
    buttons[3] = document.getElementById("score-button-text");
    buttons[4] = document.getElementById("view-button-container");
    buttons[5] = document.getElementById("view-button");
    buttons[6] = document.getElementById("view-button-clicked");
    buttons[7] = document.getElementById("view-button-text");
    buttons[8] = document.getElementById("logout-button-container");
    buttons[9] = document.getElementById("logout-button");
    buttons[10] = document.getElementById("logout-button-clicked");
    buttons[11] = document.getElementById("logout-button-text");
    
    // Iterate over the buttons[] array and check if clicked by the user
    for (let i = 0; i < buttons.length; i += 4) {
        buttons[i].addEventListener("click", function() {
            buttons[i + 1].style.display = "none"; // Hide the "unclicked" button image
            buttons[i + 2].style.display = "initial"; // Display the "clicked" button image
            buttons[i + 3].style.top = "45%"; // Move the text slightly

            // !!
            if (i == 0) {
                let scoreValue = document.getElementById("score-value").value;
                document.getElementById("score-button-input").value = scoreValue;
            }

            // After 120 ms
            setTimeout(function() {
                buttons[i + 1].style.display = "initial"; // Display the "unclicked" button image
                buttons[i + 2].style.display = "none"; // Hide the "clicked" button image
                buttons[i + 3].style.top = "50%"; // Move the text to the initial position
            }, 120);
        });
    }
});