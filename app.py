from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_security import Security, login_required, SQLAlchemySessionUserDatastore, logout_user, current_user
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()
app = Flask(__name__, static_folder="static", template_folder="templates")
app.config['SECRET_KEY'] = 'sdj@!88(1KJVU2H&754YH%L;{+)NAC12}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECURITY_PASSWORD_SALT'] = 'bcrypt'
csrf.init_app(app)

# user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
# security = Security(app, user_datastore)

clients = {}

@app.route("/register", methods=["GET", "POST"])
@login_required
def register():
    if request.method == "GET":
        return render_template("register.html")

if __name__ == "__main__":
    app.run(host="localhost", port=8001, debug=True)