
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import re

# Configure application
app = Flask(__name__)

# Configure session to be handled on the server side
# Change to browser cookies?
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

        # Check if user is logged in
        if session:
            
            # Get the score from the invisible score form
            score = request.form.get("score")

            # Query database for the user's username
            username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
            
            # Get and format current date
            current_date = datetime.now().isoformat(timespec="seconds")
            date_formatted = re.sub("T", " ", current_date)            

            # Save the score in the database
            db.execute("INSERT INTO scores (username, score, date) VALUES(?, ?, ?)", username[0]["username"], score, date_formatted)

        # Display the game without account access
        return render_template("index.html")
    
    # Check if user tries to access game in another way
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
        usernames_db = db.execute("SELECT username FROM users")

        # Check if username is provided
        if not username:
            return render_template("register.html", user_lack=user_lack)
        else:
            # Otherwise, check if username already exists in the database
            for user in usernames_db: # Iterate over all rows 
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

        # Register the user by stroing username and hashed password in the database
        db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, hash)

        # return render_template("login.html", registered=registered)
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

        # Query database for all usernames already registered
        usernames_db = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Check if username is provided
        if not username:
            return render_template("login-registered.html", user_lack=user_lack)
        # Check if username exists in the database
        elif len(usernames_db) != 1:
            return render_template("login-registered.html", user_wrong=user_wrong)
        # Check if password is provided
        if not password:
            return render_template("login-registered.html", password_lack=password_lack)
        # Check if password matches the one in the database
        elif check_password_hash(usernames_db[0]["hash"], password) != True:
            return render_template("login-registered.html", password_wrong=password_wrong)
        
        # Initiate session
        session["user_id"] = usernames_db[0]["id"]

        return redirect("/")

    return render_template("login-registered.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Clear any ongoing session
    session.clear()

    if request.method == "POST":

        # Get the data from the play button form
        play = request.form.get("name")

        # Check if play button is clicked
        if play:
            render_template("index.html")

        # Get data from the login form
        username = request.form.get("username")
        password = request.form.get("password")

        # Apologies
        user_lack = "Username required"
        user_wrong = "Wrong username"
        password_lack = "Password required"
        password_wrong = "Wrong password"

        # Query database for all usernames already registered
        usernames_db = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Check if username is provided
        if not username:
            return render_template("login.html", user_lack=user_lack)
        # Check if username exists in the database
        elif len(usernames_db) != 1:
            return render_template("login.html", user_wrong=user_wrong)
        # Check if password is provided
        if not password:
            return render_template("login.html", password_lack=password_lack)
        # Check if password matches the one in the database
        elif check_password_hash(usernames_db[0]["hash"], password) != True:
            return render_template("login.html", password_wrong=password_wrong)
        
        # Initiate session
        session["user_id"] = usernames_db[0]["id"]

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