
// Wait until the page loads
window.addEventListener("load", function() {

    // Wait until the user clicks the start button
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", function() {
        
        /** @type {HTMLCanvasElement} **/ // Suggest canvas methods

        const canvas = document.getElementById("game-canvas");
        const context = canvas.getContext("2d");
        canvas.width = 1392;
        canvas.height = 1000;
        // Put layers from game.html into an array
        const backgroundLayers = [];
        backgroundLayers[0] = document.getElementById("layer-0");
        backgroundLayers[1] = document.getElementById("layer-1");
        backgroundLayers[2] = document.getElementById("layer-2");
        backgroundLayers[3] = document.getElementById("layer-3");
        backgroundLayers[4] = document.getElementById("layer-4");
        backgroundLayers[5] = document.getElementById("layer-5");
        backgroundLayers[6] = document.getElementById("layer-6");
        backgroundLayers[7] = document.getElementById("layer-7");
        backgroundLayers[8] = document.getElementById("layer-8");
        backgroundLayers[9] = document.getElementById("layer-9");
        backgroundLayers[10] = document.getElementById("layer-10");
        const layers = [];
        let gameSpeedMod = 1;

        // Class for parallax background layers
        class Background {
            constructor(gameWidth, gameHeight, image, speed) {
                // Size and placement
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 1392;
                this.height = 1000;
                this.x = 0;
                this.y = 0;
                // Get the layer file from game.html
                this.image = image;
                // Layer speed
                this.speed = speed;
            }
            // Display the layer
            draw(context) {
                // Draw the image twice, one next to the other
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
                // Place the 2nd image immediately behind the 1st one, accounting for the layer's speed
                context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
            }
            // Animate the layer
            update() {
                this.x -= this.speed;
                if (this.x <= -this.width) {
                    this.x = 0;
                }
            }
        }

        // Class to handle user input
        class InputHandler {
            constructor() {
                // Array to store information about currently pressed button
                this.keys = [];
                // Listen for the user pressing keys
                window.addEventListener("keydown", event => {
                    // Check if any key is pressed and whether it's not in the array yet
                    if ((event.key == "ArrowDown" ||
                         event.key == "ArrowUp" ||
                         event.key == "ArrowLeft" ||
                         event.key == "ArrowRight")
                         && this.keys.indexOf(event.key) == -1) {
                        // Add the currently pressed key to the array if so
                        this.keys.push(event.key);
                    }
                });
                // Listen for the user releasing keys
                window.addEventListener("keyup", event => {
                    // Check if any key is released
                    if (event.key == "ArrowDown" ||
                        event.key == "ArrowUp" ||
                        event.key == "ArrowLeft" ||
                        event.key == "ArrowRight") {
                        // Remove the currently released key from the array if so
                        this.keys.splice(this.keys.indexOf(event.key), 1);
                        }
                });
            }
        }

        // Class for the player character
        class Player {
            constructor(gameWidth, gameHeight) {
                // Size and placement
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 256;
                this.height = 128;
                this.x = -60; // Put the player as close to the right border as possible
                this.y = gameHeight - (this.height + 120); // Put the player on the grass
                // Get the sprite image from game.html
                this.image = document.getElementById("player");
                // Properites to navigate through the sprite sheet
                this.frameX = 0;
                this.frameY = 0;
                this.maxFrame = 7; // How many horizontal frames there are on the sprite sheet
                this.fps = 10; // How quickly to switch between frames on the sprite sheet horizontally
                this.frameInterval = 1000 / this.fps; // How long should a single frame on a sprite sheet last
                this.frameTimer = 0; // Counter to keep track of frames (from 0 to frameInterval)
                // Set player horizontal speed
                this.speed = 0;
                // Properites to handle jumping
                this.jumpSpeed = 0; // Vertical speed
                this.gravity = 1; // Gravitational force to pull the player back to the ground
            }
            // Display the player
            draw(context) {
                // Draw the image, using frameX and frameY to crop it / switch between frames on the sprite sheet
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            }
            // STOP
            // Animate the player
            update(userInput, deltaTime, enemies) {

            }
        }

        // Create new objects for all background layers and put them into a new array
        for (let i = 0; i < backgroundLayers.length; i++) {
            layers[i] = new Background(canvas.width, canvas.height, backgroundLayers[i], (i / 10 + gameSpeedMod));
        }
        // Create an instance of the InputHandler class to register user input
        const userInput = new InputHandler();
        // Create an instance of the Player class to display the player character
        const player = new Player(canvas.width, canvas.height);

        // Animation loop
        function animate() {
            // Clear previous animations
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Loop through background layers
            for (let i = 0; i < layers.length; i++) {
                layers[i].draw(context); // Display layer
                layers[i].update(); // Animate layer
            }
            // Display player
            player.draw(context);
            requestAnimationFrame(animate);
        }
        animate();


    });
});