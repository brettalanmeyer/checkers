$(function(){

	var activeChecker = null;
	var turn = "black";
	var yDirBlack = +1;
	var yDirRed = -1;
	var jumping = false;

	$(".checker").on("click", function(){
		var checker = $(this);

		if(!checker.hasClass(turn) || jumping){
			return false;
		}

		var square = checker.parent(".square");

		var hasClass = checker.hasClass("selected");

		$(".checker").removeClass("selected");

		if(hasClass){
			activeChecker = null;
		} else {
			checker.addClass("selected");
			activeChecker = checker;
		}
		displayPossibleMoves(square, false);

		return false;
	});

	$(".square").on("click", function(){
		var square = $(this);

		if(jumping && !square.hasClass("possible")){
			return false;
		}

		if(isValidMove(square, false) || isValidMove(square, true)){

			activeChecker.detach();
			square.append(activeChecker);

			var x1 = parseInt(activeChecker.attr("data-x"));
			var x2 = parseInt(square.attr("data-x"));

			var y1 = parseInt(activeChecker.attr("data-y"));
			var y2 = parseInt(square.attr("data-y"));

			if(Math.abs(x2 - x1) == 2){
				var x3 = (x1 + x2) / 2;
				var y3 = (y1 + y2) / 2;
				getChecker(x3, y3).remove();
				jumping = true;
			}

			activeChecker.attr("data-x", x2);
			activeChecker.attr("data-y", y2);

			$(".square").removeClass("possible");

			if(jumping){
				displayPossibleMoves(square, true);
			}

			if($(".square.possible").length == 0){
				jumping = false;
				activeChecker.removeClass("selected");
				toggleTurn();
				checkKing();
				determineWinner();
			}

		}

	});

	function isCheckerActive(){
		return activeChecker && activeChecker.hasClass("selected");
	}

	function isValidMove(square, jump){
		var checker = square.find(".checker");

		if(!isCheckerActive() || containsChecker(square)){
			return false;
		}

		var x1 = parseInt(square.attr("data-x"));
		var x2 = parseInt(activeChecker.attr("data-x"));

		var y1 = parseInt(square.attr("data-y"));
		var y2 = parseInt(activeChecker.attr("data-y"));

		if(!isKing(activeChecker)){
			if(activeChecker.hasClass("red")){
				var yDir = yDirRed;
			} else if(activeChecker.hasClass("black")){
				var yDir = yDirBlack;
			}

			if(jump && (y1 - y2) != (yDir * 2)){
				return false;
			} else if(!jump && (y1 - y2) != yDir){
				return false;
			}
		}

		var dX = Math.abs(x1 - x2);
		var dY = Math.abs(y1 - y2);

		if(jump){
			return dX == 2 && dY == 2;
		} else {
			return dX == 1 && dY == 1;
		}

	}

	function containsChecker(square){
		return !square.find(".checker").length == 0;
	}

	function displayPossibleMoves(square, doubleJump){
		var checker = square.find(".checker");

		$(".square").removeClass("possible");

		var x = parseInt(square.attr("data-x"));
		var y = parseInt(square.attr("data-y"));

		var coords = [
			[1,1],
			[1,-1],
			[-1,1],
			[-1,-1]
		];

		for(i in coords){
			var x1 = coords[i][0];
			var y1 = coords[i][1];

			var square = getSquare(x + x1, y + y1);

			if(!doubleJump && isValidMove(square, false)){
				square.addClass("possible");
			} else if(hasOpposingPiece(square)){
				var square2 = getSquare(x + (x1 * 2), y + (y1 * 2));
				if(isValidMove(square2, true)){
					square2.addClass("possible");
				}
			}

		}

	}

	function hasOpposingPiece(square){
		return containsChecker(square) && !square.find(".checker").hasClass(turn);
	}

	function toggleTurn(){
		turn = (turn == "black" ? "red" : "black");
		$(".turn .value").html(turn);
	}

	function getSquare(x, y){
		return $(".square[data-x=" + x + "][data-y=" + y + "]");
	}

	function getChecker(x, y){
		return $(".checker[data-x=" + x + "][data-y=" + y + "]");
	}

	function determineWinner(){
		var checkers = $(".checker");
		var blacks = checkers.filter(".black");
		var reds = checkers.filter(".red");

		if(blacks.length == 0 || blacks.length == 0){
			if(blacks.length == 0){
				alert("Red Wins");
			} else if(reds.length == 0){
				alert("Black Wins");
			}
			if(confirm("Would you like to play again?")){
				window.location = "/";
			}
		}

	}

	function isKing(checker){
		return checker.hasClass("king");
	}

	function checkKing(){
		if(activeChecker.hasClass("black")){
			var y = 7;
		} else {
			var y = 0;
		}

		if(activeChecker.attr("data-y") == y){
			activeChecker.addClass("king");
		}

	}

	$(".coords-toggle").on("click", function(){
		$(".coords").toggle();
	});

});
