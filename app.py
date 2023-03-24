# For numerical/aplhabetical checks methods in Python I consulted: https://www.tutorialsteacher.com/python/string-methods
# For techniques to handle dates and regular expressions in Python I used: https://docs.python.org/3/
# For the basis of the game code and techniques I followed the course on: https://www.freecodecamp.org/news/learn-javascript-game-development-full-course/
# For information regarding JS arrays I consulted: https://www.freecodecamp.org/news/check-if-javascript-array-is-empty-or-not-with-length/
# For information on specific fonts I visited: https://www.w3.org/Style/Examples/007/fonts.en.html
# For any other HTML/CSS/JS techniques or code explanation I used information from: https://www.w3schools.com/ and https://developer.mozilla.org/

# Back-end part of the project to handle registration/logging in, sessions and scores storing

from cs50 import SQL
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import re

# Configure application
app = Flask(__name__)

# Configure session to be handled on the server side
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure SQL database
db = SQL("sqlite:///game.db")


@app.route("/", methods=["GET", "POST"])
def index():
    """Play the game"""

    # Check if user clicks "Just play" button in the login window
    if request.method == "POST":

        play = request.form.get("play")

        # Check if user is logged in
        if session:

            # Log user out if accidently accessed the "Just play" button
            if play:
                redirect("/logout")
            
            # Get the score from the invisible score form
            score = request.form.get("score")

            # Query database for the user's username
            username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
            
            # Get and format current date
            current_date = datetime.now().isoformat(timespec="seconds")
            date_formatted = re.sub("T", " ", current_date)            

            # Query database for all scores
            scores = db.execute("SELECT * FROM scores")
            # Get the number of scores records
            scores_length = len(scores)
            # Set the id of the score to be saved to 1 if there are no other records (it's the first one in the database)
            new_id = 1
            # Query database for the id of the previous record
            last_id = db.execute("SELECT id FROM scores WHERE id = ?", scores_length)
            # Set the id of the score to be saved to be 1 more than the previous one if there are other records (it's not the first one in the database)
            if last_id:
                new_id = last_id[0]["id"] + 1

            # Save the score in the database
            db.execute("INSERT INTO scores (id, username, score, date) VALUES(?, ?, ?, ?)", new_id, username[0]["username"], score, date_formatted)

        # Display the game without account access
        return render_template("index.html")
    
    # Check if user tries to access the game in another way
    else:
        # Check if logged in
        if not session:
            # Display the login window if not
            return redirect("/login")
        else:
            # Display the game with account access if so
            return render_template("index.html")
        

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        
        # Get data from the register form
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        # Apologies
        user_lack = "Username required"
        user_exists = "Username already exists"
        password_lack = "Password required"
        password_short = "Password must be at least 6 characters long"
        password_letter = "Password must contain at least 1 letter"
        password_digit = "Password must contain at least 1 digit"
        confirmation_lack = "Confirmation password required"
        confirmation_match = "Passwords don't match"

        # Query database for all usernames already registered
        usernames = db.execute("SELECT username FROM users")

        # Check if username is provided
        if not username:
            return render_template("register.html", user_lack=user_lack)
        else:
            # Otherwise, check if username already exists in the database
            for user in usernames: # Iterate over all rows 
                if user["username"] == username: # Check the content of the "username" column
                    return render_template("register.html", user_exists=user_exists)
        
        # Check if password is provided
        if not password:
            return render_template("register.html", password_lack=password_lack)
        
        # Check if password is at least 6 characters long
        if len(password) < 6:
            return render_template("register.html", password_short=password_short)

        # Check if password contains at least 1 letter and at least 1 digit
        has_letter = False
        has_digit = False

        # Iterate over all characters in the passoword
        for i in range(len(password)):
            # Check if any of them is alphabetical
            if password[i].isalpha() == True:
                has_letter = True
            # Check if any of them is numerical
            if password[i].isnumeric() == True:
                has_digit = True

        if has_letter == False:
            return render_template("register.html", password_letter=password_letter)
        if has_digit == False:
            return render_template("register.html", password_digit=password_digit)
        
        # Check if confirmation is provided
        if not confirmation:
            return render_template("register.html", confirmation_lack=confirmation_lack)

        # Check if confirmation matches the password
        if password != confirmation:
            return render_template("register.html", confirmation_match=confirmation_match)
        
        # Hash the password
        hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

        # Get the number of usernames registered
        usernames_length = len(usernames)
        # Set the id of the user to be registered to 1 if there are no other records (it's the first one in the database)
        new_id = 1
        # Query database for the id of the previous record
        last_id = db.execute("SELECT id FROM users WHERE id = ?", usernames_length)
        # Set the id of the user to be registered to be 1 more than the previous one, if there are other records (it's not the first one in the database)
        if last_id:
            new_id = last_id[0]["id"] + 1

        # Register the user by storing username and hashed password in the database
        db.execute("INSERT INTO users (id, username, hash) VALUES(?, ?, ?)", new_id, username, hash)

        return render_template("login-registered.html")

    return render_template("register.html")


@app.route("/login-registered", methods=["GET", "POST"])
def login_registered():
    """Log user in after registration"""

    # Clear any ongoing session
    session.clear()

    if request.method == "POST":

        # Get data from the login form
        username = request.form.get("username")
        password = request.form.get("password")

        # Apologies
        user_lack = "Username required"
        user_wrong = "Wrong username"
        password_lack = "Password required"
        password_wrong = "Wrong password"

        # Query database for the username provided
        usernames = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Check if username is provided
        if not username:
            return render_template("login-registered.html", user_lack=user_lack)
        # Check if username exists in the database
        elif len(usernames) != 1:
            return render_template("login-registered.html", user_wrong=user_wrong)
        # Check if password is provided
        if not password:
            return render_template("login-registered.html", password_lack=password_lack)
        # Check if password matches the one in the database
        elif check_password_hash(usernames[0]["hash"], password) != True:
            return render_template("login-registered.html", password_wrong=password_wrong)
        
        # Initiate session
        session["user_id"] = usernames[0]["id"]

        return redirect("/")

    return render_template("login-registered.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Clear any ongoing session
    session.clear()

    if request.method == "POST":

        # Get data from the login form
        username = request.form.get("username")
        password = request.form.get("password")

        # Apologies
        user_lack = "Username required"
        user_wrong = "Wrong username"
        password_lack = "Password required"
        password_wrong = "Wrong password"

        # Query database for the username provided
        usernames = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Check if username is provided
        if not username:
            return render_template("login.html", user_lack=user_lack)
        # Check if username exists in the database
        elif len(usernames) != 1:
            return render_template("login.html", user_wrong=user_wrong)
        # Check if password is provided
        if not password:
            return render_template("login.html", password_lack=password_lack)
        # Check if password matches the one in the database
        elif check_password_hash(usernames[0]["hash"], password) != True:
            return render_template("login.html", password_wrong=password_wrong)
        
        # Initiate session
        session["user_id"] = usernames[0]["id"]

        return redirect("/")

    return render_template("login.html")


@app.route("/scores")
def scores():
    """Show user's scores"""

    # Check if user is logged in
    if session:

        #Query database for the user's data
        username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
        scores = db.execute("SELECT * FROM scores WHERE username = ?", username[0]["username"])
        
        # Iterate over all scores and find the best one
        best_score = 0
        
        for i in range(len(scores)):
            # Make the first score the best one
            if i == 0:
                best_score = scores[i]["score"]
            else:
                # Update the best score if subsequent score is higher
                if scores[i]["score"] > best_score:
                    best_score = scores[i]["score"]

        return render_template("scores.html", scores=scores, best_score=best_score)

    return redirect("/")


@app.route("/credits", methods=["GET", "POST"])
def credits():
    """Show credits"""

    if request.method == "POST":

        # Get the data from the back button form
        back = request.form.get("name")

        # Check if back button is clicked
        if back:
            render_template("index.html", session=session)

    # Show credits page
    return render_template("credits.html", session=session)


@app.route("/logout")
def logout():
    """Log user out"""

    # Clear any ongoing session
    session.clear()

    return redirect("/")


@app.route("/delete", methods=["GET", "POST"])
def delete():
    """Delete user account"""

    if request.method == "POST":

        # Check if user is logged in
        if session:

            # Query database for the logged in user's username
            username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])

            # Query database for all scores and get the total number of scores recorded
            scores = db.execute("SELECT * FROM scores")
            scores_length = len(scores)

            # Check if the logged in user had any saved scores
            user_scores = db.execute("SELECT * FROM scores WHERE username = ?", username[0]["username"])

            if user_scores:

                # If so, iterate over the logged in user's scores
                for i in range(len(user_scores)):
                    
                    # Query database for the id of the first saved score of the logged in user
                    current_id = db.execute("SELECT id FROM scores WHERE username = ? LIMIT 1", username[0]["username"])
                    current_id = current_id[0]["id"]

                    # Check if the current score is the last record in the database
                    if current_id >= scores_length:
                        db.execute("DELETE FROM scores WHERE id = ?", current_id)
                        break

                    # Query database for all records past the current score
                    next_scores = db.execute("SELECT * FROM scores WHERE id > ?", current_id)
                    # Delete current score
                    db.execute("DELETE FROM scores WHERE id = ?", current_id)
                    # Iterate over all records in the database past the current score and update their ids
                    for i in range(len(next_scores)):
                        db.execute("UPDATE scores SET id = ? WHERE id = ?", current_id + i, current_id + i + 1)

            # Query database for all users past the logged in user
            next_users = db.execute("SELECT * FROM users WHERE id > ?", session["user_id"])

            # Delete the logged in user from the database
            db.execute("DELETE FROM users WHERE id = ?", session["user_id"])

            # Check if the logged in user was the last one in the database
            if next_users:
                # If no, iterate over all users past the logged in user and update their ids
                for i in range(len(next_users)):
                    db.execute("UPDATE users SET id = ? WHERE id = ?", session["user_id"] + i, next_users[i]["id"])

            # Clear any ongoing session
            session.clear()

            return redirect("/")

    return render_template("delete.html")