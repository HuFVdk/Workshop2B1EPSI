

//	Classe Espace
function Starfield() {
	this.fps = 60;
	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 25;
	this.maxVelocity = 50;
	this.stars = 1000;
	this.intervalId = 0;
}

//	Initialisation de l'objet
Starfield.prototype.initialise = function(div) {
	var self = this;
	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	window.onresize = function(event) {
		self.width = window.innerWidth;
		self.height = window.innerHeight;
		self.canvas.width = self.width;
		self.canvas.height = self.height;
		self.draw();
 	}

	//	Création du canvas
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

Starfield.prototype.start = function() {

	//	Création des étoiles
	var stars = [];
	for(var i=0; i<this.stars; i++) {
		stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.stars = stars;

	var self = this;

	this.intervalId = setInterval(function() {
		self.update();
		self.draw();	
	}, 1000 / this.fps);
};

Starfield.prototype.stop = function() {
	clearInterval(this.intervalId);
};

Starfield.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i];
		star.y += dt * star.velocity;
		//Gére le défilement des étoiles(de haut en bas) //
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*9+1,
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

Starfield.prototype.draw = function() {

	//	Dimension de la modélisation (2D ici)
	var ctx = this.canvas.getContext("2d");

	//	Arrière-plan
 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	//	Intialise les étoiles
	ctx.fillStyle = '#ffffff';
	for(var i=0; i<this.stars.length;i++) {
		var star = this.stars[i];
		ctx.fillRect(star.x, star.y, star.size, star.size);
	}
};

function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
}