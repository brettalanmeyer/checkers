import os
from flask import Flask, request, render_template
app = Flask(__name__)

from checkers.controllers import main

app.register_blueprint(main.mod)

@app.errorhandler(404)
def not_found(error):
    return render_template("main/404.html"), 404

if __name__ == "__main__":
	app.run(debug = True, host = "0.0.0.0")
