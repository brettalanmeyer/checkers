from checkers import app
from flask import Blueprint, render_template

mod = Blueprint("main", __name__, url_prefix = "/")

@app.route("/")
def main_index():
	return render_template("main/index.html")

