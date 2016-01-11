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

# def background_thread():
# 	count = 0
# 	while True:
# 		time.sleep(10)
# 		count += 1
# 		socketio.emit("response", { "data": "Server generated event", "count": count}, namespace = "/move")

@app.route("/<int:team>")
def index(team):

	if team == 0:
		color = "black"
	else:
		color = "red"

	# global thread
	# if thread is None:
	# 	thread = Thread(target=background_thread)
	# 	thread.daemon = True
	# 	thread.start()
	return render_template("board.html", color = color)

@socketio.on("move", namespace="/move")
def test_broadcast_message(message):
	# session["receive_count"] = session.get("receive_count", 0) + 1
	emit("response", {
		"x1": message["x1"],
		"x2": message["x2"],
		"y1": message["y1"],
		"y2": message["y2"],
		"black": message["black"],
		"red": message["red"]
		# "count": session["receive_count"]
	}, broadcast = True)

if __name__ == "__main__":
	socketio.run(app, debug=True, host = "0.0.0.0", port = 5020)
