// Script handling the alert

// Wait until the page loads
window.addEventListener("load", function() {

    // Check if the user is on a mobile device
    if (navigator.maxTouchPoints > 0) {
        alert("There is no mobile support as for now. For the full experience, please launch the game on a keyboard-equipped device, such as laptop or PC.");
    }

});