from gevent import monkey
monkey.patch_all()

import time
from threading import Thread
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, async_mode="gevent")
thread = None

@app.route("/<int:team>")
def index(team):

	if team == 0:
		color = "black"
	else:
		color = "red"

	return render_template("board.html", color = color)

@socketio.on("send-move", namespace="/move")
def move(data):
	emit("receive-move", {
		"x1": data["x1"],
		"x2": data["x2"],
		"y1": data["y1"],
		"y2": data["y2"],
		"black": data["black"],
		"red": data["red"]
	}, broadcast = True)

@socketio.on("send-message", namespace="/move")
def message(message):
	emit("receive-message", {
		"message": message["message"],
		"black": message["black"],
		"red": message["red"]
	}, broadcast = True)

if __name__ == "__main__":
	socketio.run(app, debug=True, host = "0.0.0.0", port = 5020)
