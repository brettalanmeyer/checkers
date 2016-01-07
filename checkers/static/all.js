$(function(){

	var activeChecker = null;
	var turn = "black";

	$(".checker").on("click", function(){
		var checker = $(this);

		if(!checker.hasClass(turn)){
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
		displayPossibleMoves(square);

		return false;
	});


	$(".square").on("click", function(){
		var square = $(this);

		if(isValidMove(square)){
			activeChecker.detach();
			activeChecker.removeClass("selected");
			square.append(activeChecker);

			activeChecker.data("x", square.data("x"));
			activeChecker.data("y", square.data("y"));

			$(".square").removeClass("possible");

			toggleTurn();
		}

	});

	function isCheckerActive(){
		return activeChecker && activeChecker.hasClass("selected");
	}

	function isValidMove(square){

		if(!isCheckerActive() || containsChecker(square)){
			return false;
		}

		var x1 = parseInt(square.data("x"));
		var x2 = parseInt(activeChecker.data("x"));

		var y1 = parseInt(square.data("y"));
		var y2 = parseInt(activeChecker.data("y"));

		return Math.abs(x1 - x2) == 1 && Math.abs(y1 - y2) == 1;

	}

	function containsChecker(square){
		return !square.find(".checker").length == 0;
	}

	function displayPossibleMoves(square){

		$(".square").removeClass("possible");

		var x = square.data("x");
		var y = square.data("y");

		var square1 = $(".square[data-x=" + (x + 1) + "][data-y=" + (y + 1) + "]");
		if(isValidMove(square1))
			square1.addClass("possible");

		var square2 = $(".square[data-x=" + (x + 1) + "][data-y=" + (y - 1) + "]")
		if(isValidMove(square2))
			square2.addClass("possible");

		var square3 = $(".square[data-x=" + (x - 1) + "][data-y=" + (y + 1) + "]")
		if(isValidMove(square3))
			square3.addClass("possible");

		var square4 = $(".square[data-x=" + (x - 1) + "][data-y=" + (y - 1) + "]")
		if(isValidMove(square4))
			square4.addClass("possible");

	}

	function toggleTurn(){
		turn = (turn == "black" ? "red" : "black");
		$(".turn .value").html(turn);
	}

});
