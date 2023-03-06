
// Wait until the page loads
window.addEventListener("load", function() {

    // Handle canvas
    const canvas = document.getElementById("game-canvas");
    const context = canvas.getContext("2d");
    canvas.width = 1392;
    canvas.height = 1000;
    // Display game title
    let title = document.getElementById("title");
    context.drawImage(title, 0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    // Black & white for shade effect
    context.fillStyle = "black";
    context.font = "120px Luminari, Papyrus, fantasy";
    context.fillText("The Eradicator", canvas.width / 2, canvas.height / 2);

    context.fillStyle = "white";
    context.font = "120px Luminari, Papyrus, fantasy";
    context.fillText("The Eradicator", canvas.width / 2 + 5, canvas.height / 2 + 5);

    // Wait until the user clicks the start button
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", function() {
        
        /** @type {HTMLCanvasElement} **/ // Suggests canvas methods

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
        // Variable to control general game speed
        let gameSpeedMod = 2.5;
        // Game state trackers
        let gameOver = false;
        let score = 0;
        let level = 0;
        // Variables to control the display of level messages
        let levelTimer = 100;
        let levelOneDisplayed = false;
        let levelTwoDisplayed = false;
        let levelThreeDisplayed = false;
        let levelFourDisplayed = false;
        let levelFiveDisplayed = false;
        // Player attacks trackers
        let attackGround = false;
        let attackJump = false;
        // Array for active dragons
        let dragons = [];
        // Array for triggered explosions
        let explosions = [];
        // Background music
        let music = new Audio();
        music.src = "resources/background/music.wav";
        music.volume = 0.1;

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
            // Displays the layer
            draw(context) {
                // Draw the image twice, one next to the other
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
                // Place the 2nd image immediately behind the 1st one
                context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
            // Animates the layer
            update() {
                // Check if the player is attacking
                if (attackGround == false) {
                    // Animate the background if not
                    this.x -= this.speed;
                    if (this.x <= -this.width) {
                        this.x = 0;
                    }
                }
            }
        }

        // Class to handle user input
        class InputHandler {
            constructor() {
                // Array to store information about currently pressed keys
                this.keys = [];
                // Listen for the user pressing keys
                window.addEventListener("keydown", event => {
                    // Check if any key is pressed and whether it's not in the array yet
                    if ((event.key == " " ||
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
                    if (event.key == " " ||
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
                this.y = this.gameHeight - (this.height + 120); // Put the player on the grass
                // Get the sprite image from game.html
                this.image = document.getElementById("player");
                // Get the spell sound effect
                this.spellSound = new Audio();
                this.spellSound.src = "resources/player/spell.mp3";
                // Get the death sound effect
                this.deathSound = new Audio();
                this.deathSound.src = "resources/player/death.mp3";
                this.deathSound.volume = 0.5;
                // Properites to navigate through the sprite sheet
                this.frameX = 0;
                this.frameY = 0;
                this.maxFrame = 7; // How many horizontal character frames there are on the sprite sheet
                this.fps = 12; // How quickly to switch between character frames on the sprite sheet horizontally
                this.frameInterval = 1000 / this.fps; // How long should a single character frame on the sprite sheet last
                this.frameTimer = 0; // Counter to keep track of game frames (from 0 to frameInterval)
                // Set player's horizontal speed
                this.speed = 0;
                // Properites to handle jumping
                this.jumpSpeed = 0; // Vertical speed
                this.gravity = 1; // Gravitational force to pull the player back to the ground
            }
            // Displays the player
            draw(context) {

                // HIT BOXES
                // context.strokeStyle = "white";
                // context.beginPath();
                // context.rect(this.x + (this.width / 3.5), this.y + (this.height / 10), this.width - (this.width / 3.5) - (this.width / 2.1), this.height - (this.height / 10));
                // context.stroke();

                // Draw the image, using frameX and frameY to crop it / switch between character frames on the sprite sheet
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            }
            // Animates the player
            update(userInput, deltaTime, dragons) {
                
                // COLLISSION DETECTION

                // Iterate over all active dragons
                dragons.forEach(dragon => {
                    // Dragon's hit box
                    let dragonFront = dragon.x + (dragon.width / 8); // Dragon's hit box front
                    let dragonRear = dragon.x + (dragon.width - (dragon.width /5)); // Dragon's hit box rear
                    let dragonTop = dragon.y + (dragon.height / 2.5); // Dragon's hit box top
                    let dragonBottom = dragon.y + (dragon.height - (this.height / 8)); // Dragon's hit box bottom
                    // Player's hit box
                    let playerFront = this.x + (this.width - (this.width / 2.1)); // Player's hit box front
                    let playerRear = this.x + (this.width / 3.5); // Player's hit box rear
                    let playerTop = this.y + (this.height / 10); // Player's hit box top
                    let playerBottom = this.y + this.height; // Player's hit box bottom

                    // Player hit
                    if (dragonFront > playerFront ||
                        dragonRear < playerRear ||
                        dragonBottom < playerTop ||
                        dragonTop > playerBottom
                        ) {
                        // No collission
                    }
                    else {
                        // Collission otherwise
                        gameOver = true;
                    }

                    // Player attack
                    if (attackGround == true || attackJump == true) {
                        let groundAttackTop = this.y + this.height / 8; // Top range of the ground attack
                        let groundAttackBottom = this.y + this.height / 2; // Bottom range of the ground attack
                        let groundAttackRange = this.x + 2 * (this.width / 2.5); // Horizontal range of the ground attack
                        let jumpAttackTop = this.y; // Top range of the jump attack
                        let jumpAttackBottom = this.y + 0.75 * this.height; // Bottom range of the jump attack
                        let jumpAttackRange = this.x + this.width / 2.5 + this.width / 3.5; // Horizontal range of the ground attack
                        
                        // Check if player attacks from the ground
                        if (attackGround == true) {
                            // Check if dragon's in range
                             if (dragonBottom > groundAttackTop && dragonTop < groundAttackBottom && (dragon.x < groundAttackRange && dragon.x > playerFront)) {
                                // Kill the dragon and trigger explosion
                                explosions.push(new Explosion(dragon.x, dragon.y));
                                dragon.killed = true;
                             }
                        }
                        // Check if player attacks while jumping
                        if (attackJump == true) {
                            // Check if dragon's in range
                            if (dragonBottom > jumpAttackTop && dragonTop < jumpAttackBottom && (dragon.x < jumpAttackRange && dragon.x > playerFront)) {
                                // Kill the dragon and trigger explosion
                                explosions.push(new Explosion(dragon.x, dragon.y));
                                dragon.killed = true;
                            }
                        }
                        // Increase score if dragon killed
                        if (dragon.killed == true) {
                            score++;
                        }
                    }
                });

                // PLAYER ANIMATION

                // Check if current character frame should finish
                if (this.frameTimer > this.frameInterval) {
                    // Check if it's the last character frame (horizontally) on the sprite sheet
                    if (this.frameX >= this.maxFrame) {
                        // Switch to the first character frame on the sprite sheet if so
                        this.frameX = 0;
                        // Check if the player is attacking
                        if (attackGround == true) {
                            // Finish the attack if so
                            attackGround = false;
                            // Stop the spell sound effect
                            this.spellSound.pause();
                        }
                        if (attackJump == true) {
                            // Finish the attack if so
                            attackJump = false;
                            // Stop the spell sound effect
                            this.spellSound.pause();
                        }
                    }
                    else {
                        // Otherwise, keep switching character frames on the sprite sheet
                        this.frameX++;
                    }
                    // Reset the game frame counter
                    this.frameTimer = 0;
                }
                else {
                    // Otherwise keep increasing the game frame counter
                    this.frameTimer += deltaTime;
                }
                
                // PLAYER CONTROLS

                // Check if user pressed the right arrow key
                if (userInput.keys.indexOf("ArrowRight") != -1 && attackGround == false) {
                    // Increase horizontal speed if so
                    this.speed = 5;
                }
                // Check if user pressed the left arrow key
                else if (userInput.keys.indexOf("ArrowLeft") != -1 && attackGround == false) {
                    // Decrease horizontal speed if so
                    this.speed = -5;
                }
                // Check if user pressed the spacebar key while on the ground
                else if (userInput.keys.indexOf(" ") != -1 && this.onGround() == true) {
                    // Initiate the appropriate attack
                    attackGround = true;
                }
                else {
                    // Otherwise, don't move
                    this.speed = 0;
                }
                
                // The two conditions below have to be independent from those above to allow simultaneous jumping and moving horizontally
                // Check if user pressed the up arrow key being on the ground
                if (userInput.keys.indexOf("ArrowUp") != -1 && this.onGround() == true) {
                    // Jump if so
                    this.jumpSpeed -= 30;
                }
                // Check if user pressed the spacebar key while jumping
                if (userInput.keys.indexOf(" ") != -1 && this.onGround() == false) {
                    // Initiate the appropriate attack
                    attackJump = true;
                }
                
                // HORIZONTAL MOVEMENT

                // Keep moving horizontally if not attacking on the ground
                if (attackGround == false) {
                    this.x += this.speed;
                }
                // Make sure player doesn't go beyond canvas borders horizontally
                if (this.x < -60) { // Left border
                    this.x = -60;
                }
                else if (this.x > this.gameWidth - this.width + 120) { // Right border
                    this.x = this.gameWidth - this.width + 120;
                }
                
                // VERTICAL MOVEMENT

                // Keep moving vertically
                this.y += this.jumpSpeed;
                // Make sure player comes back to the ground if jumping
                if (this.onGround() == false) {
                    this.jumpSpeed += this.gravity; // Keep pulling the player back down
                    this.maxFrame = 5; // Set the number of character frames for jumping on the sprite sheer
                    this.frameY = 1; // Switch to the row with jumping animation on the sprite sheet
                    // Check if the player is attacking while jumping
                    if (attackJump == true) {
                        // Play the spell sound effect
                        this.spellSound.play();
                        // Switch to attack character frames on the sprite sheet if so
                        this.maxFrame = 7;
                        this.frameY = 3;
                    }
                }
                else {
                    // Otherwise switch to horizontal movement character frames on the sprite sheet
                    this.jumpSpeed = 0;
                    this.maxFrame = 7;
                    this.frameY = 0;
                    // Check if the player is attacking on the ground
                    if (attackGround == true) {
                        // Play the spell sound effect
                        this.spellSound.play();
                        // Switch to attack character frames on the sprite sheet if so
                        this.maxFrame = 7;
                        this.frameY = 2;
                    }
                }
                // Make sure player lands on the ground after a jump
                if (this.y > this.gameHeight - (this.height + 120)) {
                    this.y = this.gameHeight - (this.height + 120);
                }
            }
            // Determines if player's on the ground
            onGround() {
                // Check if player's jumping
                if (this.y >= this.gameHeight - (this.height + 120)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        // Class for the dragons
        class Dragon {
            constructor(gameWidth, gameHeight) {
                // Size and placement
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 216;
                this.height = 150;
                this.x = this.gameWidth;
                this.y = this.gameHeight - (this.height + 120) - (Math.random() * 300); // Randomize vertical position
                // Get the sprite image from game.html
                this.image = document.getElementById("dragon");
                // Get the roar sound
                this.roarSound = new Audio();
                this.roarSound.src = "resources/enemies/roar.wav";
                this.roarSound.volume = 0.3;
                this.roarRandom = Math.random(); // Roar sound randomizer
                this.roarPlayed = false; // Raor sound tracker
                // Properites to navigate through the sprite sheet
                this.frameX = 0;
                this.frameY = 0;
                this.maxFrame = 2; // How many horizontal character frames there are on the sprite sheet
                this.fps = 10; // How quickly to switch between character frames on the sprite sheet horizontally
                this.frameInterval = 1000 / this.fps; // How long should a single character frame on the sprite sheet last
                this.frameTimer = 0; // Counter to keep track of game frames (from 0 to frameInterval)
                // Set dragon's horizontal speed
                this.speed = Math.random() + 5; //Randomize speed
                // Variables to control dragon's vertical movement
                this.angle = Math.random() * 2; // Starting wave amplitude
                this.angleSpeed = Math.random() * 0.2; // Allow for randomized wavy movement
                this.amplitude = Math.random() * 5; // Amplitude magnifier
                // Trackers for dragons to be deleted
                this.markedForDeletion = false;
                this.killed = false;
            }
            // Displays the dragon
            draw(context) {

                // HIT BOXES
                // context.strokeStyle = "white";
                // context.beginPath();
                // context.rect(this.x + (this.width / 8), this.y + (this.height / 2.5), this.width - (this.width / 8) - (this.width /5), this.height - (this.height / 2.5) - (this.height / 8));
                // context.stroke();

                // Draw the image, using frameX and frameY to crop it / switch between character frames on the sprite sheet
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            }
            // Animates the dragon
            update(deltaTime) {
                // Check if current character frame should finish
                if (this.frameTimer > this.frameInterval) {
                    // Check if it's the last character frame (horizontally) on the sprite sheet
                    if (this.frameX >= this.maxFrame) {
                        // Switch to the first character frame on the sprite sheet if so
                        this.frameX = 0;
                    }
                    else {
                        // Otherwise, keep switching character frames on the sprite sheet
                        this.frameX++;
                    }
                    // Reset the game frame counter
                    this.frameTimer = 0;
                }
                else {
                    // Otherwise keep increasing the game frame counter
                    this.frameTimer += deltaTime;
                }
                // Move dragon from right to left
                this.x -= this.speed;
                // Check if dragon off screen
                if (this.x < 0 - this.width) {
                    // Mark it for deletion if so
                    this.markedForDeletion = true;
                }

                // DIFFICULTY

                // Level 1
                if (score >= 5) {
                    level = 1;
                    dragonInterval = 400; // Increase dragon spawning frequency
                }
                // Level 2
                if (score >= 10) {
                    level = 2;
                    this.speed = Math.random() * 5 + 5; // Increase speed
                }
                // Level 3
                if (score >= 20) {
                    level = 3;
                    this.y += this.amplitude * Math.sin(this.angle); // Keep changing vertical position by an amplitude (down)
                    this.angle += this.angleSpeed; // Make the movement wavy (up and down)
                }
                // Level 4
                if (score >= 30) {
                    level = 4;
                    this.speed = Math.random() * 5 + 7.5; // Increase speed
                }
                // Level 5
                if (score >= 50) {
                    level = 5;
                    this.speed = Math.random() * 5 + 10; // Increase speed
                    this.amplitude = Math.random() * 15; // Increase wavy movement amplitude
                }

                // Make sure the dragon doesn't fall through the ground
                if (this.y >= this.gameHeight - (this.height + 120)) {
                    this.y = this.gameHeight - (this.height + 120);
                }

                // Play dragon screams randomly
                if (this.roarPlayed == false && (this.roarRandom < 0.2) && (this.x > this.gameWidth - (this.gameWidth / 3))) {
                    this.roarSound.play();
                    this.roarPlayed == true;
                }
            }
        }

        // Class for explosions
        class Explosion {
            constructor(x, y) { // Gets coordinates of the dragon
                // Size and placement
                this.imageWidth = 96;
                this.imageHeight = 88;
                this.width = this.imageWidth * 2;
                this.height = this.imageHeight * 2;
                this.x = x + 12;
                this.y = y - 13;
                // Get the sprite image from game.html
                this.image = document.getElementById("explosion");
                // Get the sound effect from game.html
                this.sound = new Audio();
                this.sound.src = "resources/explosion/explosion.mp3";
                this.sound.volume = 0.3;
                // Properites to navigate through the sprite sheet
                this.frame = 0;
                this.maxFrame = 4; // How many horizontal character frames there are on the sprite sheet
                this.fps = 10; // How quickly to switch between character frames on the sprite sheet horizontally
                this.frameInterval = 1000 / this.fps; // How long should a single character frame on the sprite sheet last
                this.frameTimer = 0; // Counter to keep track of game frames (from 0 to frameInterval)
                // Tracker for explosions to be deleted
                this.markedForDeletion = false;
            }
            // Displays the explosion
            draw(context) {
                context.drawImage(this.image, this.imageWidth * this.frame, 0, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);
            }
            // Animates the explosion
            update(deltaTime) {
                // Play the sound effect
                this.sound.play();
                // Check if current character frame should finish
                if (this.frameTimer >= this.frameInterval) {
                    // Check if it's the last character frame (horizontally) on the sprite sheet
                    if (this.frame >= this.maxFrame) {
                        this.markedForDeletion = true;                   
                    }
                    else {
                        // Otherwise, keep switching character frames on the sprite sheet
                        this.frame++;
                    }
                    // Reset the game frame counter
                    this.frameTimer = 0;
                }
                else {
                    // Otherwise keep increasing the game frame counter
                    this.frameTimer += deltaTime;
                }
            }
        }

        // Handles explosions
        function triggerExplosions(deltaTime) {
            // Iterate over all active explosions
            explosions.forEach(explosion => {
                explosion.draw(context); // Display explosions
                explosion.update(deltaTime) // Animate explosions
            });
            // Update the explosions array by filtering out explosions marked for deletion
            explosions = explosions.filter(explosion => {
                // Keep only explosions not marked for deletion
                if (explosion.markedForDeletion == false) {
                    return explosion;
                }
                else {
                    return null;
                }
            });
        }

        // Handles dragons
        function handleDragons(deltaTime) {
            // Variable to randomize dragon spawning
            let randomDragonInterval = Math.random() * 100000 + 100;
            // Check if enough time has passed to spawn a new dragon
            if (dragonTimer > (dragonInterval + randomDragonInterval)) {
                // Spawn a new dragon if so and add it to the active dragons array
                dragons.push(new Dragon(canvas.width, canvas.height));
                // Reset the timer
                dragonTimer = 0;
            }
            else {
                // Keep tracking game time otherwise
                dragonTimer += deltaTime;
            }
            // Iterate all active dragons
            dragons.forEach(dragon => {
                dragon.draw(context); // Display dragons
                dragon.update(deltaTime); // Animate dragons
            });
            // Update the dragons array by filtering out dragons marked for deletion
            dragons = dragons.filter(dragon => {
                // Keep only dragons not marked for deletion
                if (dragon.markedForDeletion == false && dragon.killed == false) {
                    return dragon;
                }
                else {
                    return null;
                }
            });
        }

        // Displays game status
        function displayStatus(context) {
            // Current score
            context.textAlign = "center";
            // Black & white for shade effect
            context.fillStyle = "black";
            context.font = "40px Luminari";
            context.fillText("Score: " + score, 100, 60);

            context.fillStyle = "white";
            context.font = "40px Luminari";
            context.fillText("Score: " + score, 104, 64);

            // Display level message according to current level
            if (levelTimer > 0 && gameOver == false) {
                switch (level) {
                    case 0:
                        break;
                    case 1:
                        // Check if the timer is still ticking for this level
                        if (levelOneDisplayed == false) {
                            // Black & white for shade effect
                            context.fillStyle = "black";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 1", canvas.width / 2, canvas.height / 2);
        
                            context.fillStyle = "white";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 1", canvas.width / 2 + 4, canvas.height / 2 + 4);
                            levelTimer--; // Keep decreasing the timer
                            // Check if timer's out
                            if (levelTimer == 0) {
                                levelOneDisplayed = true; // Mark level info as displayed
                                levelTimer = 100; // Reset the timer
                            }
                        }                        
                        break;
                    case 2:
                        // Check if the timer is still ticking for this level
                        if (levelTwoDisplayed == false) {
                            // Black & white for shade effect
                            context.fillStyle = "black";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 2", canvas.width / 2, canvas.height / 2);
        
                            context.fillStyle = "white";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 2", canvas.width / 2 + 4, canvas.height / 2 + 4);
                            levelTimer--; // Keep decreasing the timer
                            // Check if timer's out
                            if (levelTimer == 0) {
                                levelTwoDisplayed = true; // Mark level info as displayed
                                levelTimer = 100; // Reset the timer
                            }
                        }                        
                        break;
                    case 3:
                        // Check if the timer is still ticking for this level
                        if (levelThreeDisplayed == false) {
                            // Black & white for shade effect
                            context.fillStyle = "black";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 3", canvas.width / 2, canvas.height / 2);
        
                            context.fillStyle = "white";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 3", canvas.width / 2 + 4, canvas.height / 2 + 4);
                            levelTimer--; // Keep decreasing the timer
                            // Check if timer's out
                            if (levelTimer == 0) {
                                levelThreeDisplayed = true; // Mark level info as displayed
                                levelTimer = 100; // Reset the timer
                            }
                        }                        
                        break;
                    case 4:
                        // Check if the timer is still ticking for this level
                        if (levelFourDisplayed == false) {
                            // Black & white for shade effect
                            context.fillStyle = "black";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 4", canvas.width / 2, canvas.height / 2);
        
                            context.fillStyle = "white";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 4", canvas.width / 2 + 4, canvas.height / 2 + 4);
                            levelTimer--; // Keep decreasing the timer
                            // Check if timer's out
                            if (levelTimer == 0) {
                                levelFourDisplayed = true; // Mark level info as displayed
                                levelTimer = 100; // Reset the timer
                            }
                        }                        
                        break;
                    case 5:
                        // Check if the timer is still ticking for this level
                        if (levelFiveDisplayed == false) {
                            // Black & white for shade effect
                            context.fillStyle = "black";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 5", canvas.width / 2, canvas.height / 2);
        
                            context.fillStyle = "white";
                            context.font = "70px Luminari, Papyrus, fantasy";
                            context.fillText("Level 5", canvas.width / 2 + 4, canvas.height / 2 + 4);
                            levelTimer--; // Keep decreasing the timer
                            // Check if timer's out
                            if (levelTimer == 0) {
                                levelFiveDisplayed = true; // Mark level info as displayed
                                levelTimer = 100; // Reset the timer
                            }
                        }                        
                        break;
                }
            }

            // Game over message
            if (gameOver == true) {
                // Black & white for shade effect
                context.fillStyle = "black";
                context.font = "80px Luminari, Papyrus, fantasy";
                context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
                
                context.fillStyle = "white";
                context.font = "80px Luminari, Papyrus, fantasy";
                context.fillText("GAME OVER", canvas.width / 2 + 4, canvas.height / 2 + 4);
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
        // Variable to keep track of game frames duration
        let lastTime = 0;
        // Variable to time dragon spawning
        let dragonTimer = 0;
        // Variable to control dragon spawning frequency
        let dragonInterval = 2500;

        // Animation loop
        function animate(timeStamp) {
            // Declare deltaTime to keep track of how many ms 1 game frame takes on the user machine
            const deltaTime = timeStamp - lastTime;
            // Update the lastTime stamp to the current timeStamp
            lastTime = timeStamp;
            // Clear previous animations
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Loop through background layers
            for (let i = 0; i < layers.length; i++) {
                layers[i].draw(context); // Display layer
                layers[i].update(); // Animate layer
            }
            player.draw(context); // Display player
            player.update(userInput, deltaTime, dragons); // Animate player
            handleDragons(deltaTime); // Display and animate dragons
            triggerExplosions(deltaTime); // Display and animate explosions
            displayStatus(context); // Display game status
            // Check if game over
            if (gameOver == true) {
                document.getElementById("start").disabled = false; // Enable the start game button
                music.pause(); // Stop the background music
                player.spellSound.pause(); // Stop potential spell sound effect if game over
                player.deathSound.play(); // Play the death sound if game over
            }
            else {
                document.getElementById("start").disabled = true; // Disable the start game button
                music.play(); // Play the background music
                requestAnimationFrame(animate); // Keep playing
            }
        }
        animate(0); // Call the animation loop, passing a non-significant argument for the first time (no timeStamp yet)
    });
});