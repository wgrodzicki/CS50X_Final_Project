// Script handling the buttons

// Wait until the page loads
window.addEventListener("load", function() {

    // Get the title of the current page
    documentTitle = document.title;
    // Get all conditionally displayed parts on the current page
    documentConditionalParts = document.getElementsByClassName("conditional-part");
    // Prepare an empty array for the content of the conditional parts
    conditionalParts = [];

    // Loop over all conditional parts on the current page and put their contents into the array
    for (let i = 0; i < documentConditionalParts.length; i++) {
        conditionalParts[i] = documentConditionalParts[i].innerHTML;
    }

    // Animates buttons
    function animateButtons(buttons) {

        // Iterate over all buttons
        for (let i = 0; i < buttons.length; i += 4) {

            // Check if button is clicked
            buttons[i].addEventListener("click", function() {
                buttons[i + 1].style.display = "none"; // Hide the "unclicked" button image
                buttons[i + 2].style.display = "initial"; // Display the "clicked" button image
                buttons[i + 3].style.marginTop = "-1%"; // Move the button text slightly

                // After 120 ms reverse the above changes
                setTimeout(function() {
                    buttons[i + 1].style.display = "initial";
                    buttons[i + 2].style.display = "none";
                    buttons[i + 3].style.marginTop = "0%";
                }, 120);
            });
        }
    }

    // Check if user visits the register.html page
    if (documentTitle.includes("Register") == true) {

        // Put all buttons in an array
        let buttons = [];
        buttons[0] = document.getElementById("register-form-button");
        buttons[1] = document.getElementById("register-button");
        buttons[2] = document.getElementById("register-button-clicked");
        buttons[3] = document.getElementById("register-button-text");
        buttons[4] = document.getElementById("register-back-button-container");
        buttons[5] = document.getElementById("register-back-button");
        buttons[6] = document.getElementById("register-back-button-clicked");
        buttons[7] = document.getElementById("register-back-button-text");

        animateButtons(buttons);
    }

    // Check if user visits the login.html page
    if (documentTitle.includes("Log in") == true && conditionalParts.indexOf("login_registered") == -1) {

        // Put all buttons in an array
        let buttons = [];
        buttons[0] = document.getElementById("login-form-button");
        buttons[1] = document.getElementById("login-button");
        buttons[2] = document.getElementById("login-button-clicked");
        buttons[3] = document.getElementById("login-button-text");
        buttons[4] = document.getElementById("register-login-button-container");
        buttons[5] = document.getElementById("register-login-button");
        buttons[6] = document.getElementById("register-login-button-clicked");
        buttons[7] = document.getElementById("register-login-button-text");
        buttons[8] = document.getElementById("play-form-button");
        buttons[9] = document.getElementById("play-button");
        buttons[10] = document.getElementById("play-button-clicked");
        buttons[11] = document.getElementById("play-button-text");

        animateButtons(buttons);
    }

    // Check if user visits the login.html page after registration
    if (documentTitle.includes("Log in") == true && conditionalParts.indexOf("login_registered") != -1) {

        // Put login button elements in an array
        let buttons = [];
        buttons[0] = document.getElementById("login-form-button");
        buttons[1] = document.getElementById("login-button");
        buttons[2] = document.getElementById("login-button-clicked");
        buttons[3] = document.getElementById("login-button-text");

        animateButtons(buttons);
    }
    
    // Check if user visits the index.html page
    if (documentTitle.includes("Game") == true) {

        // Put credits button elements in an array
        let buttonsCredits = [];
        buttonsCredits[0] = document.getElementById("credits-button-container");
        buttonsCredits[1] = document.getElementById("credits-button");
        buttonsCredits[2] = document.getElementById("credits-button-clicked");
        buttonsCredits[3] = document.getElementById("credits-button-text");

        animateButtons(buttonsCredits);

        // Check if user is unregistered
        if (conditionalParts.indexOf("index_unregistered") != -1) {

            // Put back button elements in an array
            let buttonsUnregistered = [];
            buttonsUnregistered[0] = document.getElementById("index-back-button-container");
            buttonsUnregistered[1] = document.getElementById("index-back-button");
            buttonsUnregistered[2] = document.getElementById("index-back-button-clicked");
            buttonsUnregistered[3] = document.getElementById("index-back-button-text");

            animateButtons(buttonsUnregistered);
        }
        // Check if user is registered and logged in
        else if (conditionalParts.indexOf("index_registered") != -1) {

            // Put all buttons in an array
            let buttonsRegistered = [];
            buttonsRegistered[0] = document.getElementById("score-button-container");
            buttonsRegistered[1] = document.getElementById("score-button");
            buttonsRegistered[2] = document.getElementById("score-button-clicked");
            buttonsRegistered[3] = document.getElementById("score-button-text");
            buttonsRegistered[4] = document.getElementById("view-button-container");
            buttonsRegistered[5] = document.getElementById("view-button");
            buttonsRegistered[6] = document.getElementById("view-button-clicked");
            buttonsRegistered[7] = document.getElementById("view-button-text");
            buttonsRegistered[8] = document.getElementById("logout-button-container");
            buttonsRegistered[9] = document.getElementById("logout-button");
            buttonsRegistered[10] = document.getElementById("logout-button-clicked");
            buttonsRegistered[11] = document.getElementById("logout-button-text");
            buttonsRegistered[12] = document.getElementById("delete-button-container");
            buttonsRegistered[13] = document.getElementById("delete-button");
            buttonsRegistered[14] = document.getElementById("delete-button-clicked");
            buttonsRegistered[15] = document.getElementById("delete-button-text");

            // Iterate over all buttons
            for (let i = 0; i < buttonsRegistered.length; i += 4) {

                // Check if button is clicked
                buttonsRegistered[i].addEventListener("click", function() {
                    buttonsRegistered[i + 1].style.display = "none"; // Hide the "unclicked" button image
                    buttonsRegistered[i + 2].style.display = "initial"; // Display the "clicked" button image
                    buttonsRegistered[i + 3].style.marginTop = "-1%"; // Move the button text slightly

                    // Pass the score to the button form if save button clicked
                    if (i == 0) {
                        let scoreValue = document.getElementById("score-value").value;
                        document.getElementById("score-button-input").value = scoreValue;
                    }

                    // After 120 ms reverse the above changes
                    setTimeout(function() {
                        buttonsRegistered[i + 1].style.display = "initial";
                        buttonsRegistered[i + 2].style.display = "none";
                        buttonsRegistered[i + 3].style.marginTop = "0%";
                    }, 120);
                });
            }
        }
    }

    // Check if user visits the credits.html or the scores.html page
    if (documentTitle.includes("Credits") == true || documentTitle.includes("View scores") == true) {
        
        // Check if user is unregistered
        if (conditionalParts.indexOf("credits_unregistered") != -1) {

            // Put back button elements in an array
            let buttonsUnregistered = [];
            buttonsUnregistered[0] = document.getElementById("scores-credits-unregistered-back-form-button");
            buttonsUnregistered[1] = document.getElementById("scores-credits-unregistered-back-button");
            buttonsUnregistered[2] = document.getElementById("scores-credits-unregistered-back-button-clicked");
            buttonsUnregistered[3] = document.getElementById("scores-credits-unregistered-back-button-text");

            animateButtons(buttonsUnregistered);
        }
        // Otherwise (user registered and logged in)
        else {

            // Put back button elements in an array
            let buttons = [];
            buttons[0] = document.getElementById("scores-credits-back-button-container");
            buttons[1] = document.getElementById("scores-credits-back-button");
            buttons[2] = document.getElementById("scores-credits-back-button-clicked");
            buttons[3] = document.getElementById("scores-credits-back-button-text");

            animateButtons(buttons);
        }
    }

    // Check if user visits the delete.html page
    if (documentTitle.includes("Delete account") == true) {
        
        // Put all buttons in an array
        let buttons = [];
        buttons[0] = document.getElementById("delete-yes-form-button");
        buttons[1] = document.getElementById("delete-yes-button");
        buttons[2] = document.getElementById("delete-yes-button-clicked");
        buttons[3] = document.getElementById("delete-yes-button-text");
        buttons[4] = document.getElementById("delete-no-button-container");
        buttons[5] = document.getElementById("delete-no-button");
        buttons[6] = document.getElementById("delete-no-button-clicked");
        buttons[7] = document.getElementById("delete-no-button-text");

        animateButtons(buttons);
    }
});