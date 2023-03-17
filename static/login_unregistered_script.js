
// Wait until the page loads
window.addEventListener("load", function() {

    // Put all buttons in an array
    let buttons = [];
    buttons[0] = document.getElementById("register-login-button-container");
    buttons[1] = document.getElementById("register-login-button");
    buttons[2] = document.getElementById("register-login-button-clicked");
    buttons[3] = document.getElementById("register-login-button-text");
    buttons[4] = document.getElementById("play-form-button");
    buttons[5] = document.getElementById("play-button");
    buttons[6] = document.getElementById("play-button-clicked");
    buttons[7] = document.getElementById("play-button-text");
    
    // Iterate over the buttons[] array and check if clicked by the user
    for (let i = 0; i < buttons.length; i += 4) {
        buttons[i].addEventListener("click", function() {
            buttons[i + 1].style.display = "none"; // Hide the "unclicked" button image
            buttons[i + 2].style.display = "initial"; // Display the "clicked" button image
            buttons[i + 3].style.marginTop = "-1%"; // Move the text slightly
            // After 120 ms
            setTimeout(function() {
                buttons[i + 1].style.display = "initial"; // Display the "unclicked" button image
                buttons[i + 2].style.display = "none"; // Hide the "clicked" button image
                buttons[i + 3].marginTop = "0%"; // Move the text to the initial position
            }, 120);
        });
    }
});