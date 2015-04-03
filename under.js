var coinimg = new Image();
coinimg.src = "coin.png";

var coins_life_time = 1000;
var coin_speed = [0,-0.05];
var coins = [];
var rem_coins = [];

var mouseX = 0;
var mouseY = 0;

var context;
var canvas;

//Play coin sound
function play(){
	var audio = document.getElementById("oneup");
	audio.play();
}

//Milliseconds
function MS(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

var Coin = function(time){
	this.spawntime = time;
	this.mov = [0,0];
	this.alpha = 1;
};
Coin.prototype.position = [0,0];
Coin.prototype.alpha = 0;
Coin.prototype.mov = [0,0];
Coin.prototype.spawntime = 0;
Coin.prototype.alive = true;
Coin.prototype.update = function(){
	//Accelerate
	this.mov[0] += coin_speed[0];
	this.mov[1] += coin_speed[1];
	//Move
	this.position[0] += this.mov[0];
	this.position[1] += this.mov[1];
	
	//Update alpha
	life = (this.spawntime+coins_life_time)-MS();
	v = (life/(coins_life_time*0.7));
	if(v > 0){
		this.alpha = v;
	}
	/*console.log(this.alpha);*/
	
	//Die
	if(MS() > (this.spawntime+coins_life_time)){
		this.alive = false;
		/*console.log("dead");*/
	}
};

function spawnCoin(x,y){
	var c = new Coin(MS());
	c.position = [x,y];
	coins.push(c);
}

function initCoins(){
	//Make a full page canvas
	canvas = document.createElement('canvas');
	canvas.style.width='100%';
	canvas.style.height='100%';
	
	//Draw on the entire page
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//Can't click on this canvas
	canvas.style.pointerEvents='none';
	
	//Position canvas
	canvas.style.position='absolute';
	canvas.style.zIndex=9999999;
	canvas.style.left=0;
	canvas.style.top=0;
	
	//Add the canvas
	document.body.appendChild(canvas);
	
	//Save context
	context = canvas.getContext('2d');
	
	//Start drawing
	window.requestAnimationFrame(draw);
	
	//Spawning
	$( ".sound" ).click(
		function(e){
			play();
			//spawnCoin(e.pageX, e.pageY);
			spawnCoin(mouseX, mouseY);
			/*console.log("Spawned coin at: "+e.pageX+" "+e.pageY);*/
		}
	);
	
	//Track mouse
	$("body").mousemove(function(e) {
	    mouseX = e.pageX;
	    mouseY = e.pageY;
	});
}

function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(draw);
	//Iterate through coin array
	for(i = 0; i < coins.length; i++){
		var coin = coins[i];
		
		//Update coin or mark for deletion
		if(coin.alive){
			coin.update();
			//draw also
			context.save();
			context.globalAlpha = coin.alpha;
			context.drawImage(coinimg,coin.position[0],coin.position[1]);
			context.restore();
		}else{
			rem_coins.push(i);
		}
	}
	
	//Remove dead coins
	for(rm in rem_coins){
		coins.splice(rm, 1);
	}
	rem_coins.splice(0, rem_coins.length);
}
