# **The Eradicator**
## Wojciech Grodzicki's CS50x Final Project
#
This is "The Eradicator", a 2D side-scroller game available directly in the browser. You can play it straight away or, optionally, register to set up an account and keep track of your scores!

![Menu sample](/game/static/images/title_sample.png)

## **Learning through gaming**

Computer games are what got me into coding in the first place. I'm also a firm believer in the "learning through gaming" approach to gaining new skills. That being said, a programming field I wanted to explore more is web development. That's why I decided to combine both and create for my final project an online, web-based game.

## **Features**

#### **Game**
- spellcaster player character
- 2 movement patterns: running and jumping
- 2 attack modes: in the air and on the ground
- 5 difficulty levels with different enemy movement patterns
- plenty of atmospheric sound effects
- option to change screen size

#### **Application**
- optional account creation with custom credentials (username, password)
- session storage
- score saving and browsing
- option to delete account

## **How to play?**

#### **Choosing game mode**

Upon opening the website you are prompted to log in to your account (after having registered if that's your first visit). Setting up an account let's you save your scores and access them whenever you want. If you decide you no longer need the account, you can always delete it. However, this functionality can be skipped altogether and you can just play.

![Menu sample](/game/static/images/login_sample.png)

#### **Main goal**

The game itself is fairly simple. It's an endless 2D side-scroller where you become a wizard with magic powers whose task is to defend his homeland by defeating flying monsters. The more creatures you strike down, the more points you gain. Coming into contact with the enemies results in losing the game.

#### **Player controls**

Control the character using you keyboard:

- press left/right arrow keys to run
- press up arrow key to jump
- press spacebar to attack

You can jump and attack at the same time, while attacking on the ground makes the character stop moving Attacks in the air have a shorter range, but cover more space. On the contrary, attacks from the ground have a longer range, but require more precision. Also note that keeping the spacebar pressed allows for long-lasting attacks.

![Menu sample](/game/static/images/gameplay_sample.png)

Take advantage of differences between attack modes and combine them with well-timed movement to reach and dodge enemies effectively!

#### **Difficulty levels**

There are 5 difficulty levels you can unlock after having defeated a sufficient number of opponents. With every level enemies spawn more frequently, move faster and/or change their movement patterns.

## **Some technicalities**

#### **Front-end**

For the markup and styling of the website I used HTML, CSS and [Bootstrap](https://getbootstrap.com/). The game itself was implemented in pure JavaScript using the code base provided in the FreeCodeCamp's ["JavaScript Game Development Course for Beginners"](https://www.freecodecamp.org/news/learn-javascript-game-development-full-course/).

#### **Back-end**

The server-side of the application was implemented in Python using the [Flask](https://flask.palletsprojects.com/en/2.2.x/quickstart/) framework. To handle basic database operations I used [SQLite](https://sqlite.org/index.html).

#### **Main challenges**

When designing and implementing the project I stumbled upon several challenges:

- Character attacks: I needed to figure out how to properly render attack animations and determine their reach. The solution was to: re-design the character sprite sheet so that it had no blank spaces; appropriately insert the attack controls into the movement code with boolean variables to keep track of the attack mode and character position (in the air/on the ground); tie attacks ranges to character and enemy hit boxes.

- Difficulty level: I wanted the diffculty level to affect enemy behaviour and to be updated depending on player's score. The solution was to: include the code changing enemy movement inside the enemy class; declare a global variable to keep track of the level and update it inside the enemy class; create a switch statement in the function responsible for displaying level messages that evaluates the global variable value with every animation frame.

- Button animation: I found assets for "clicked" and "unclicked" button images, so I wanted to animate them dynamically and give them real "button properties". The solution was to: place HTML buttons and/or links over button images; add function listening to the click event and reacting by hiding the "unclicked" image, displaying the "clicked" image and slightly changing the position of button text for a short period, creating the effect of interactive buttons.

- Playing without logging in: one of my goals was to give the user a choice whether to set up an account or not, but implementing this option turned out to be tricky. The solutin was to: 

- Updating the database: 

## **Future plans**

I plan to deploy the application and make it avaiable online. In the future I would also like to add mobile support to the game.

## **Credits**

#### **Game code basis**

- 

#### **Assets**

- 

#### **Music & sound effects**

- 

