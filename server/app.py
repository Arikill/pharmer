from flask import Flask, request, jsonify, render_template, session, redirect
from flask_wtf import CSRFProtect
from database.api import database 

csrf = CSRFProtect()
app = Flask(__name__, static_folder="./static", template_folder="./templates")
app.config["SECRET_KEY"] = ")BUyg&^&h30t521UYFeE^&^79JoIh&"
app.config["MONGO_DB"] = "local"
app.config["MONGO_URI"] = "mongodb://localhost:27017/pharmer"
app.config["SECURITY_PASSWORD_SALT"] = "bcrypt"
host = "localhost"
port = 8000
csrf.init_app(app)
db = database(app)


@app.route("/database", methods=["GET", "POST"])
def dbase():
    if "username" in session:
        if request.method == "GET":
            template_variables = {}
            template_variables["title"] = "Login"
            return render_template("database.html", variables=template_variables)
        elif request.method == "POST":
            db.writeGenes(session["username"], request.files["genes"])
            db.writeCellValues(session["username"], request.files["cell-values"])
            return jsonify({"status": "received"})
    else:
        print("Session has expired");
        return redirect("/login")



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if "username" in session:
            if db.isUserOnline(session["username"])["status"]:
                return redirect("/database")
        template_variables = {}
        template_variables["title"] = "Login"
        return render_template("login.html", variables=template_variables)
    elif request.method == "POST":
        if db.isAuthorized(email=request.form["email"], password=request.form["password"])["status"]:
            db.updateUserOnlineStatus(email=request.form["email"], status=True)
            session["username"] = request.form["email"]
            return redirect("/database")
        return redirect("/login")

@app.route("/logout", methods=["GET"])
def logout():
    db.updateUserOnlineStatus(email=session["username"], status=False)
    session.pop("username", None)
    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        template_variables = {}
        template_variables["title"] = "Registration"
        return render_template("register.html", variables=template_variables)
    elif request.method == "POST":
        if db.createUser(
            firstname = request.form["firstname"],
            lastname=request.form["lastname"], 
            email=request.form["email"],
            password=request.form["password"])["status"] == True:
            session["username"] = request.form["email"]
            db.updateUserOnlineStatus(email = session["username"], status = True)
        else:
            template_variables = {}
            template_variables["message"] = "Failed to create user!"
            return render_template("register.html", variables=template_variables)
    return redirect("/login")

if __name__ == '__main__':
    app.run(host=host, port=port, debug=True)