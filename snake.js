//set up canvas

$(document).ready(function(){ //jquery stuff, what is jquery?
	

	//need to set the height and width to the screen size
	console.log("document height over 2 is " + $(window).height()/2);
	$("#canvas").attr("width", $(window).height()/1.1);
	$("#canvas").attr("height", $(window).height()/1.1);

	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var wid = Math.round($("#canvas").height());
	var hei = Math.round($("#canvas").height());
	//console.log(wid + " " + hei)// " rather than " + $("#canvas").width() +)
	
	var color = ["blue", "green", "magenta", "olive", "orange", "palegreen",
				"plum", "tomato"];
	var cur_color = 0;

	var cell_wid = (1/45)*$("canvas").attr("width");
	var dir;
	var food;
	var score;
	var counter;

	var snake_array;

	function local_storage_setup() {
//to reset high score
		//store.set("highscore", {user: "Empty", score: 0, date: Date()});

		if(store.disable != true)
			console.log("local storage enabled");

		if(store.get("highscore") == undefined) {
			//if there is no previous highscore, save high score of 0
			var fillerDate = new Date(0);
			store.set("highscore", {user: "Empty", score: 0, date: fillerDate});
		}
	}

	local_storage_setup();

	function init() 
	{
		dir = "right";
		create_snake();
		create_food();
		score = 0;
		counter = 0;
		$(".highscore").text("High Score is " + store.get("highscore").score + " by " 
			+ store.get("highscore").user + " on " + store.get("highscore").date);

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60); //set paint function for every 60 ms
	}
	init();

	function create_snake()
	{
		var length = 5;
		snake_array = [];
		for(var i = length - 1; i >= 0; i--) {
			snake_array.push({x:i, y:0});
		}
	}

	function create_food() 
	{
		food = { 
			x: Math.round(Math.random()*(wid-cell_wid)/cell_wid),
			y: Math.round(Math.random()*(hei-cell_wid)/cell_wid)
		}
	}

	function paint()
	{
		counter++;
		if(counter > 30) {
			counter = 0;
			cur_color++;
			if(cur_color >= color.length)
				cur_color = 0;
		}

		ctx.fillStyle = "white";
		ctx.fillRect(0,0, wid, hei); 

		var new_snake_x = snake_array[0].x;
		var new_snake_y = snake_array[0].y;

		if(dir == "right") new_snake_x++;
		else if(dir == "left") new_snake_x--;
		else if(dir == "up") new_snake_y--;
		else if(dir == "down") new_snake_y++;

		if(new_snake_x == -1 || new_snake_x >= wid/cell_wid || new_snake_y == -1 
			|| new_snake_y >= hei/cell_wid 
			|| check_collision(new_snake_x, new_snake_y, snake_array)) {
			//game over, check high score and then restart
			high_score_store();
			init();
			return;
		}

		if(new_snake_x == food.x && new_snake_y == food.y) {
			var tail = {x:new_snake_x, y:new_snake_y};
			score++;

			create_food();
		} else {
			var tail = snake_array.pop();
			tail.x = new_snake_x;
			tail.y = new_snake_y;
		}

		snake_array.unshift(tail);

		for(var i = 0; i < snake_array.length; i++) {
			
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}

		paint_cell(food.x, food.y);
		
		//print current score to screen
		$(".cur_score").text("Current Score: " + score);
	}

	function paint_cell(x, y) 
	{

		ctx.fillStyle = color[cur_color];
		ctx.fillRect(x*cell_wid, y*cell_wid, cell_wid, cell_wid);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_wid, y*cell_wid, cell_wid, cell_wid);
	}
	
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y){
				return true;
			}
		}
		return false;
	}

	function high_score_store() {
		var prev_high = store.get("highscore").score;


		//if recent score is 
		if(score > prev_high) {
			console.log("score > high score");

			//get user name
			var userName = get_user_name();

			store.set("highscore", {user: userName, score: score, date: Date()});
			console.log("new high score is "+ store.get("highscore").score + " by " +
				store.get("highscore").user + " on " + store.get("highscore").date);

			replace_score();

		} else {
//test
			//console.log("old high score remains " + store.get("highscore").score);

		}
	}

	function get_user_name() 
	{
		return prompt("Congratulations! New high score!", "Type your name here");
	}


	$(document).keydown(function(e) {
		var key = e.which;
		if(key =="37" && dir != "right") dir = "left";
		else if(key == "38" && dir != "down") dir = "up";
		else if(key == "39" && dir != "left") dir = "right";
		else if(key == "40" && dir != "up") dir = "down";
		else if(key == "32") {
			cur_color++
			if(cur_color >= color.length) {
				cur_color = 0;
			} 
		}
	})

	function replace_score() 
	{
		$(".highscore").fadeOut(1000);
		$(".highscore").text("High Score is " + store.get("highscore").score + " by " + 
			store.get("highscore").user + " on " + store.get("highscore").date);
		$(".highscore").fadeIn(1000);

	}


})


