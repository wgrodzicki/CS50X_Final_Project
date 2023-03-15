
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

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
    
    # Control if user visits routes after having registered
    registered = False

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
        confirmation_match = "Passwords don's match"

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

        # Variable to control if user visits the login window after having registered
        registered = True

        return render_template("login.html", registered=registered)

    return render_template("register.html", registered=registered)

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Clear any ongoing session
    session.clear()

    if request.method == "POST":

        # Get the data from the play button form
        play = request.form.get("name")

        # If anything submitted (play button clicked)
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

@app.route("/logout")
def logout():
    """Log user out"""

    # Clear any ongoing session
    session.clear()

    return redirect("/")