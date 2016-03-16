
function Game() {

    // Configuration de la partie 
    this.config = {
        bombintensité: 0.30,
        bombMinvitesse: 70,
        bombMaxvitesse: 100,
        ennemiInitialvitesse: 55,
        ennemiAcceleration: 0.10,
        ennemiespaçage: 40,
        missilevitesse: 220,
        missileMaxfeuintensité: 4,
        gameWidth: 600,
        gameHeight: 500,
        fps: 120,
       
        ennemiunités: 5,
        ennemiFiles: 10,
        vaisseauSpeed: 170,
        niveaudifficultéMultiplier: 0.3,
        pointsPerennemi: 50
    };


    this.vies = 5;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
    this.niveau = 1;
    this.stateStack = [];
    this.pressedKeys = {};
    this.gameCanvas =  null;


}

//  Initialise le canvas pour le jeu
Game.prototype.initialise = function(gameCanvas) {

    //Intégre le canvas
    this.gameCanvas = gameCanvas;

    // Dimensionnage de l'espace de jeu
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    //  Limite de l'espace de jeu
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

Game.prototype.moveToState = function(state) {
 

   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }
   

   if(state.enter) {
     state.enter(game);
   }
 

   this.stateStack.pop();
   this.stateStack.push(state);
 };

//  Lancement de jeu
Game.prototype.start = function() {

    //Période de lançement
    this.moveToState(new WelcomeState());

    //Variable de jeu (santé)
    this.lives = 3;

    //  Procédure de jeu
    var game = this;
    this.intervalId = setInterval(function () { GameLoop(game);}, 1000 / this.config.fps);

};


Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

//  Mutes or unmutes the game.
Game.prototype.mute = function(mute) {

    //  If we've been told to mute, mute.
    if(mute === true) {
        this.sounds.mute = true;
    } else if (mute === false) {
        this.sounds.mute = false;
    } else {
        // Toggle mute instead...
        this.sounds.mute = this.sounds.mute ? false : true;
    }
};

//  The main loop.
function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        var dt = 1 / game.config.fps;

        //  Get the drawing context.
        var ctx = this.gameCanvas.getContext("2d");
        
        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.pushState = function(state) {

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
};

Game.prototype.popState = function() {

    //  Leave and pop the state.
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        //  Set the current state.
        this.stateStack.pop();
    }
};

//  The stop function stops the game.
Game.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

//  Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

//  Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

function WelcomeState() {

}

WelcomeState.prototype.enter = function(game) {

    // Create and load the sounds.
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/shoot.wav');
    game.sounds.loadSound('bang', 'sounds/bang.wav');
    game.sounds.loadSound('explosion', 'sounds/explosion.wav');
};

WelcomeState.prototype.update = function (game, dt) {


};

WelcomeState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Qu'est ce qui se passe dans l'espace ?!", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";

    ctx.fillText("Pressez 'Espace' pour lancer la partie.", game.width / 2, game.height/2);
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space starts the game.
        game.niveau = 1;
        game.score = 0;
        game.lives = 3;
        game.moveToState(new niveauIntroState(game.niveau));
    }
};

function GameOverState() {

}

GameOverState.prototype.update = function(game, dt) {

};

GameOverState.prototype.draw = function(game, dt, ctx) {

    //Restaurer l'arrière plan
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="50px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Fin de la partie!", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
    ctx.fillText("Votre score est de " + game.score + " vous avez atteint le niveau " + game.niveau, game.width / 2, game.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Pressez Espace pour jouer de nouveau.", game.width / 2, game.height/2 + 40);
};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32)  {//  Espace relance le jeu//
        game.lives = 3;
        game.score = 0;
        game.niveau = 1;
        game.moveToState(new niveauIntroState(1));
    }
};

//Niveau et environnement actuel//
function PlayState(config, niveau) {
    this.config = config;
    this.niveau = niveau;

    //  Game state.
    this.ennemiCurrentvitesse =  10;
    this.ennemiCurrentespaçage =  0;
    this.ennemisAreDropping =  false;
    this.lastmissileTime = null;

    //  Game entities.
    this.vaisseau = null;
    this.ennemis = [];
    this.missiles = [];
    this.bombs = [];
}

PlayState.prototype.enter = function(game) {

    //  Create the vaisseau.
    this.vaisseau = new vaisseau(game.width / 2, game.gameBounds.bottom);

    //  Setup initial state.
    this.ennemiCurrentvitesse =  10;
    this.ennemiCurrentespaçage =  0;
    this.ennemisAreDropping =  false;

    //  Set the vaisseau speed for this niveau, as well as ennemi params.
    var niveauMultiplier = this.niveau * this.config.niveaudifficultéMultiplier;
    this.vaisseauSpeed = this.config.vaisseauSpeed;
    this.ennemiInitialvitesse = this.config.ennemiInitialvitesse + (niveauMultiplier * this.config.ennemiInitialvitesse);
    this.bombintensité = this.config.bombintensité + (niveauMultiplier * this.config.bombintensité);
    this.bombMinvitesse = this.config.bombMinvitesse + (niveauMultiplier * this.config.bombMinvitesse);
    this.bombMaxvitesse = this.config.bombMaxvitesse + (niveauMultiplier * this.config.bombMaxvitesse);

    //  Create the ennemis.
    var unités = this.config.ennemiunités;
    var files = this.config.ennemiFiles;
    var ennemis = [];
    for(var rank = 0; rank < unités; rank++){
        for(var file = 0; file < files; file++) {
            ennemis.push(new ennemi(
                (game.width / 2) + ((files/2 - file) * 200 / files),
                (game.gameBounds.top + rank * 20),
                rank, file, 'ennemi'));
        }
    }
    this.ennemis = ennemis;
    this.ennemiCurrentvitesse = this.ennemiInitialvitesse;
    this.ennemivitesse = {x: -this.ennemiInitialvitesse, y:0};
    this.ennemiNextvitesse = null;
};

PlayState.prototype.update = function(game, dt) {
    
    //  If the left or right arrow keys are pressed, move
    //  the vaisseau. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the vaisseau would move
    //  more like a text editor caret.
    if(game.pressedKeys[37]) {
        this.vaisseau.x -= this.vaisseauSpeed * dt;
    }
    if(game.pressedKeys[39]) {
        this.vaisseau.x += this.vaisseauSpeed * dt;
    }
    if(game.pressedKeys[32]) {
        this.feumissile();
    }

    //  Keep the vaisseau in bounds.
    if(this.vaisseau.x < game.gameBounds.left) {
        this.vaisseau.x = game.gameBounds.left;
    }
    if(this.vaisseau.x > game.gameBounds.right) {
        this.vaisseau.x = game.gameBounds.right;
    }

    //  Move each bomb.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        bomb.y += dt * bomb.vitesse;

        //  If the missile has gone off the screen remove it.
        if(bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    //  Move each missile.
    for(i=0; i<this.missiles.length; i++) {
        var missile = this.missiles[i];
        missile.y -= dt * missile.vitesse;

        //  If the missile has gone off the screen remove it.
        if(missile.y < 0) {
            this.missiles.splice(i--, 1);
        }
    }

    //  Move the ennemis.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for(i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        var newx = ennemi.x + this.ennemivitesse.x * dt;
        var newy = ennemi.y + this.ennemivitesse.y * dt;
        if(hitLeft == false && newx < game.gameBounds.left) {
            hitLeft = true;
        }
        else if(hitRight == false && newx > game.gameBounds.right) {
            hitRight = true;
        }
        else if(hitBottom == false && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            ennemi.x = newx;
            ennemi.y = newy;
        }
    }

    //  Update ennemi velocities.
    if(this.ennemisAreDropping) {
        this.ennemiCurrentespaçage += this.ennemivitesse.y * dt;
        if(this.ennemiCurrentespaçage >= this.config.ennemiespaçage) {
            this.ennemisAreDropping = false;
            this.ennemivitesse = this.ennemiNextvitesse;
            this.ennemiCurrentespaçage = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) {
        this.ennemiCurrentvitesse += this.config.ennemiAcceleration;
        this.ennemivitesse = {x: 0, y:this.ennemiCurrentvitesse };
        this.ennemisAreDropping = true;
        this.ennemiNextvitesse = {x: this.ennemiCurrentvitesse , y:0};
    }
    //  If we've hit the right, move down then left.
    if(hitRight) {
        this.ennemiCurrentvitesse += this.config.ennemiAcceleration;
        this.ennemivitesse = {x: 0, y:this.ennemiCurrentvitesse };
        this.ennemisAreDropping = true;
        this.ennemiNextvitesse = {x: -this.ennemiCurrentvitesse , y:0};
    }
    //  If we've hit the bottom, it's fin de la partie.
    if(hitBottom) {
        this.lives = 0;
    }
    
    //  Check for missile/ennemi collisions.
    for(i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        var bang = false;

        for(var j=0; j<this.missiles.length; j++){
            var missile = this.missiles[j];

            if(missile.x >= (ennemi.x - ennemi.width/2) && missile.x <= (ennemi.x + ennemi.width/2) &&
                missile.y >= (ennemi.y - ennemi.height/2) && missile.y <= (ennemi.y + ennemi.height/2)) {
                
                //  Remove the missile, set 'bang' so we don't process
                //  this missile again.
                this.missiles.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerennemi;
                break;
            }
        }
        if(bang) {
            this.ennemis.splice(i--, 1);
            game.sounds.playSound('bang');
        }
    }

    //  Find all of the front rank ennemis.
    var frontRankennemis = {};
    for(var i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        //  If we have no ennemi for game file, or the ennemi
        //  for game file is futher behind, set the front
        //  rank ennemi to game one.
        if(!frontRankennemis[ennemi.file] || frontRankennemis[ennemi.file].rank < ennemi.rank) {
            frontRankennemis[ennemi.file] = ennemi;
        }
    }

    //  Give each front rank ennemi a chance to drop a bomb.
    for(var i=0; i<this.config.ennemiFiles; i++) {
        var ennemi = frontRankennemis[i];
        if(!ennemi) continue;
        var chance = this.bombintensité * dt;
        if(chance > Math.random()) {
            //  feu!
            this.bombs.push(new Bomb(ennemi.x, ennemi.y + ennemi.height / 2, 
                this.bombMinvitesse + Math.random()*(this.bombMaxvitesse - this.bombMinvitesse)));
        }
    }

    //  Check for bomb/vaisseau collisions.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        if(bomb.x >= (this.vaisseau.x - this.vaisseau.width/2) && bomb.x <= (this.vaisseau.x + this.vaisseau.width/2) &&
                bomb.y >= (this.vaisseau.y - this.vaisseau.height/2) && bomb.y <= (this.vaisseau.y + this.vaisseau.height/2)) {
            this.bombs.splice(i--, 1);
            game.lives--;
            game.sounds.playSound('explosion');
        }
                
    }

    //  Check for ennemi/vaisseau collisions.
    for(var i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        if((ennemi.x + ennemi.width/2) > (this.vaisseau.x - this.vaisseau.width/2) && 
            (ennemi.x - ennemi.width/2) < (this.vaisseau.x + this.vaisseau.width/2) &&
            (ennemi.y + ennemi.height/2) > (this.vaisseau.y - this.vaisseau.height/2) &&
            (ennemi.y - ennemi.height/2) < (this.vaisseau.y + this.vaisseau.height/2)) {
            //  Dead by collision!
            game.lives = 0;
            game.sounds.playSound('explosion');
        }
    }

    //  Check for failure
    if(game.lives <= 0) {
        game.moveToState(new GameOverState());
    }

    //  Check for victory
    if(this.ennemis.length === 0) {
        game.score += this.niveau * 50;
        game.niveau += 1;
        game.moveToState(new niveauIntroState(game.niveau));
    }
};

PlayState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    
    //  Draw vaisseau.
    ctx.fillStyle = '#999999';
    ctx.fillRect(this.vaisseau.x - (this.vaisseau.width / 2), this.vaisseau.y - (this.vaisseau.height / 2), this.vaisseau.width, this.vaisseau.height);

    //  Draw ennemis.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        ctx.fillRect(ennemi.x - ennemi.width/2, ennemi.y - ennemi.height/2, ennemi.width, ennemi.height);
    }

    //  Draw bombs.
    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y - 2, 4, 4);
    }

    //  Draw missiles.
    ctx.fillStyle = '#ff0000';
    for(var i=0; i<this.missiles.length; i++) {
        var missile = this.missiles[i];
        ctx.fillRect(missile.x, missile.y - 2, 1, 4);
    }

    //  Draw info.
    var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    var info = "Vies: " + game.lives;
    ctx.textAlign = "left";
    ctx.fillText(info, game.gameBounds.left, textYpos);
    info = "Score: " + game.score + " - Niveau: " + game.niveau;
    ctx.textAlign = "right";
    ctx.fillText(info, game.gameBounds.right, textYpos);

    //  If we're in debug mode, draw bounds.
    if(this.config.debugMode) {
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(0,0,game.width, game.height);
        ctx.strokeRect(game.gameBounds.left, game.gameBounds.top,
            game.gameBounds.right - game.gameBounds.left,
            game.gameBounds.bottom - game.gameBounds.top);
    }

};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == 32) {
        //  feu!
        this.feumissile();
    }
    if(keyCode == 80) {
        //  Push the pause state.
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

PlayState.prototype.feumissile = function() {
    //  If we have no last missile time, or the last missile time 
    //  is older than the max missile intensité, we can feu.
    if(this.lastmissileTime === null || ((new Date()).valueOf() - this.lastmissileTime) > (1000 / this.config.missileMaxfeuintensité))
    {   
        //  Add a missile.
        this.missiles.push(new missile(this.vaisseau.x, this.vaisseau.y - 12, this.config.missilevitesse));
        this.lastmissileTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        game.sounds.playSound('shoot');
    }
};

function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == 80) {
        //  Pop the pause state.
        game.popState();
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Paused", game.width / 2, game.height/2);
    return;
};

/*  
    niveau Intro State

    The niveau Intro state shows a 'niveau X' message and
    a countdown for the niveau.
*/
function niveauIntroState(niveau) {
    this.niveau = niveau;
    this.countdownMessage = "3";
}

niveauIntroState.prototype.update = function(game, dt) {

    //  Update the countdown.
    if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= dt;

    if(this.countdown < 2) { 
        this.countdownMessage = "2"; 
    }
    if(this.countdown < 1) { 
        this.countdownMessage = "1"; 
    } 
    if(this.countdown <= 0) {
        //  Move to the next niveau, popping this state.
        game.moveToState(new PlayState(game.config, this.niveau));
    }

};

niveauIntroState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle"; 
    ctx.textAlign="center"; 
    ctx.fillText("Niveau " + this.niveau, game.width / 2, game.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Lancement dans " + this.countdownMessage, game.width / 2, game.height/2 + 36);      
    return;
};


/*
 
  vaisseau

  The vaisseau has a position and that's about it.

*/
function vaisseau(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 16;
}

/*
    missile

    feud by the vaisseau, they've got a position, vitesse and state.

    */
function missile(x, y, vitesse) {
    this.x = x;
    this.y = y;
    this.vitesse = vitesse;
}

/*
    Bomb

    Dropped by ennemis, they've got position, vitesse.

*/
function Bomb(x, y, vitesse) {
    this.x = x;
    this.y = y;
    this.vitesse = vitesse;
}
 
/*
    ennemi 

    ennemi's have position, type, rank/file and that's about it. 
*/

function ennemi(x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 18;
    this.height = 14;
}

/*
    Game State

    A Game State is simply an update and draw proc.
    When a game is in the state, the update and draw procs are
    called, with a dt value (dt is delta time, i.e. the number)
    of seconds to update or draw).

*/
function GameState(updateProc, drawProc, keyDown, keyUp, enter, leave) {
    this.updateProc = updateProc;
    this.drawProc = drawProc;
    this.keyDown = keyDown;
    this.keyUp = keyUp;
    this.enter = enter;
    this.leave = leave;
}

/*

    Sounds

    The sounds class is used to asynchronously load sounds and allow
    them to be played.

*/
function Sounds() {

    //  The audio context.
    this.audioContext = null;

    //  The actual set of loaded sounds.
    this.sounds = {};
}

Sounds.prototype.init = function() {

    //  Create the audio context, paying attention to webkit browsers.
    context = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new context();
    this.mute = false;
};

Sounds.prototype.loadSound = function(name, url) {

    //  Reference to ourselves for closures.
    var self = this;

    //  Create an entry in the sounds object.
    this.sounds[name] = null;

    //  Create an asynchronous request for the sound.
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        self.audioContext.decodeAudioData(req.response, function(buffer) {
            self.sounds[name] = {buffer: buffer};
        });
    };
    try {
      req.send();
    } catch(e) {
      console.log("An exception occured getting sound the sound " + name + " this might be " +
         "because the page is running from the file system, not a webserver.");
      console.log(e);
    }
};

Sounds.prototype.playSound = function(name) {

    //  If we've not got the sound, don't bother playing it.
    if(this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
        return;
    }

    //  Create a sound source, set the buffer, connect to the speakers and
    //  play the sound.
    var source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name].buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
};
