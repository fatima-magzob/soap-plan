
const score	   = document.querySelector('.score');
const gameDiv  = document.querySelector('.game');
const gamearea = document.querySelector('.gamearea');
const gMessage = document.querySelector('.game-message');

let keys ={
	space:false
};

let player ={
	score:0,
	speed:2,
	inplay:false,
};

// events
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);
document.addEventListener('click', start);

function pressOn(e){
	e.preventDefault();
	let tempKey = (e.key == ' ') ? 'space' : e.key;
	keys[tempKey] = true;
	//console.log(keys);
}

function pressOff(e){
	e.preventDefault();
	let tempKey = (e.key == ' ') ? 'space' : e.key;
	keys[tempKey] = false;
	// console.log(keys);
}

function start(e){
	gMessage.classList.add('hide');
	score.classList.remove('hide');	
	if(!player.inplay){
		gamearea.innerHTML = '';
		gamearea.classList.remove('hide');
		player.inplay = true;
		player.ready  = true;
		player.score  = 2000;

		player.level	  = 10;
		player.totalBomb  = 3;		
		player.bombScore  = 0;
		player.activeBomb = 0;

		makeBase();		
		player.plane  = document.createElement('div');
		player.plane.setAttribute('class','plane');
		gamearea.append(player.plane);
		player.x = player.plane.offsetLeft;
		player.y = player.plane.offsetTop;
		window.requestAnimationFrame(playGame);
	}
}

function makeBase(){
	player.level--;
	if(player.level < 0){
		endGame();
	}else{
		player.base = document.createElement('div');
		player.base.setAttribute('class','base');
		player.base.style.width  = Math.floor(Math.random()*10 )  + 100 + 'px';
		player.base.style.height = Math.floor(Math.random()*200 ) + 100 + 'px';
		player.base.style.left   = Math.floor(Math.random()*(gamearea.offsetWidth - 200)) + 100 + 'px';
		gamearea.append(player.base);
	}
}

function makeBomb(){
	if(player.ready && player.activeBomb <= player.totalBomb){
		player.score -= 300;
		player.bombScore++;
		player.activeBomb++;
		let bomb = document.createElement('div');
		bomb.setAttribute('class','bomb');
		bomb.x = player.x;
		bomb.y = (player.y + player.plane.offsetHeight);
		bomb.style.left = bomb.x + 'px';
		bomb.style.top  = bomb.y + 'px';
		bomb.innerHTML  = player.bombScore;
		gamearea.appendChild(bomb);
		player.ready = false;
		setTimeout(function(){
			player.ready = true;
		}, 300);
	}
}

function moveBombs(){
	let bombs = document.querySelectorAll('.bomb');
	//console.log(bombs);
	bombs.forEach(function(item){		 
		item.y += 5;
		item.style.top = item.y + 'px';
		if(item.y > 600){
			player.activeBomb--;
			item.parentElement.removeChild(item);
		}
		if(isCollide(item, player.base)){
			player.score += 2000;
			player.activeBomb--;
			player.base.parentElement.removeChild(player.base);
			setTimeout(() => {
				item.parentElement.removeChild(item);
			},80);			
			makeBase();
		} 
	})
}

function isCollide(bomb, base){
	let bombRect = bomb.getBoundingClientRect();
	let baseRect = base.getBoundingClientRect();
	return !(
		(bombRect.top > baseRect.bottom)||
		(bombRect.bottom < baseRect.top)||
		(bombRect.left > baseRect.right)||
		(bombRect.right < baseRect.left)
	)

}

function playGame(){
	if(player.inplay){
		moveBombs();
		if(keys.space) 
			makeBomb();		 
		if(keys.ArrowRight && player.x < (gamearea.offsetWidth - 100)) 
			player.x += player.speed;
		if(keys.ArrowLeft && player.x > 0) 	
			player.x -= player.speed;		
		if(keys.ArrowDown && player.y < 200) 	
			player.y += player.speed;
		if(keys.ArrowUp && player.y > 20) 
			player.y -= player.speed;

		player.x += (player.speed*2);
		if(player.x > (gamearea.offsetWidth - 100)){
			player.x = 0;
			player.score -= 100;
		}
		// to walk to left without this the plane will move slowly forward
		if(keys.ArrowLeft){
			player.x += -(player.speed*2);
		}
		player.score--;
		if(player.score < 0)
			player.score = 0;

		player.plane.style.top  = player.y + 'px';
		player.plane.style.left = player.x + 'px';
		window.requestAnimationFrame(playGame);
		score.innerHTML = 'Score ' + player.score;
	}
	//player.inplay = false;
}

function endGame(){
	player.inplay = false;
	gMessage.classList.remove('hide');
	gamearea.classList.add('hide');
	score.classList.add('hide');
	player.score = 0;
}

// Oreilly plane bomber game by Laurence Svekis course //
