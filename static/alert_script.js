// Script handling the alert

// Wait until the page loads
window.addEventListener("load", function() {

    // Check if the user is on a mobile device
    if (navigator.maxTouchPoints > 0) {
        alert("Currently, mobile support is still experimental. For the best experience consider launching the game on a laptop or PC.");
    }

});