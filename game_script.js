
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
        // Puy layers from game.html into an array
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
            // Move the layer
            update() {
                this.x -= this.speed;
                if (this.x <= -this.width) {
                    this.x = 0;
                }
            }
        }

        // Create new objects for all background layers and put them into a new array
        for (let i = 0; i < backgroundLayers.length; i++) {
            layers[i] = new Background(canvas.width, canvas.height, backgroundLayers[i], (i / 10 + gameSpeedMod));
        }

        // Animation loop
        function animate() {
            // Clear previous animations
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Loop through background layers
            for (let i = 0; i < layers.length; i++) {
                layers[i].draw(context); // Draw layer
                layers[i].update(); // Move layer
            }
            requestAnimationFrame(animate);
        }
        animate();


    });
});