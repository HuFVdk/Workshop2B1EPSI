



//  Crée une instance de la classe Jeu
function Jeu() {

    //  Configuration initiale
    this.config = {
        bombvit: 0.05,
        vitesse: 50,
        bombMaxvitesse: 500,
        ennemiInitialvitesse: 25,
        ennemiAcceleration: 0,
        ennemichuteDistance: 20,
        missilevitesse: 140,
        missilevitmax: 3,
        JeuWidth: 900,
        JeuHeight: 600,
        fps: 60,

        ennemiRanks: 5,
        ennemiFiles: 10,
        vaisseauvitesse: 120,
        multiplicateurdifficultélv: 0.2,
        pointsParennemi: 50
    };

    //  Etat de jeu en temps réel
    this.vies = 3;
    this.width = 0;
    this.height = 0;
    this.Jeulimites = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
    this.niveau = 1;



    //  Input/output
    this.pressedKeys = {};
    this.JeuCanvas =  null;


}

//Initialisation du jeu
Jeu.prototype.initialise = function(JeuCanvas) {

    //  Set the Jeu canvas.
    this.JeuCanvas = JeuCanvas;

    // Défini hauteur/largeur (paramétre)
    this.width = JeuCanvas.width;
    this.height = JeuCanvas.height;

    //  Set the etat Jeu limites.
    this.Jeulimites = {
        left: JeuCanvas.width / 2 - this.config.JeuWidth / 2,
        right: JeuCanvas.width / 2 + this.config.JeuWidth / 2,
        top: JeuCanvas.height / 2 - this.config.JeuHeight / 2,
        bottom: JeuCanvas.height / 2 + this.config.JeuHeight / 2,
    };
};



//  Set the current etat.
this.etatStack.pop();
this.etatStack.push(etat);
};

//  Start the Jeu.
Jeu.prototype.start = function() {

    //  Start the Jeu loop.
    var Jeu = this;
    this.intervalId = setInterval(function () { JeuLoop(Jeu);}, 1000 / this.config.fps);

};

//  Returns the current etat.
Jeu.prototype.currentetat = function() {
    return this.etatStack.length > 0 ? this.etatStack[this.etatStack.length - 1] : null;
};

/

//  The main loop.
function JeuLoop(Jeu) {
    var currentetat = Jeu.currentetat();
    if(currentetat) {

        //  Delta t is the time to update/draw.
        var dt = 1 / Jeu.config.fps;

        //  Get the drawing context.
        var ctx = this.JeuCanvas.getContext("2d");

        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentetat.update) {
            currentetat.update(Jeu, dt);
        }
        if(currentetat.draw) {
            currentetat.draw(Jeu, dt, ctx);
        }
    }
}



Jeu.prototype.popetat = function() {

    //  Leave and pop the etat.
    if(this.currentetat()) {
        if(this.currentetat().leave) {
            this.currentetat().leave(Jeu);
        }

        //  Set the current etat.
        this.etatStack.pop();
    }
};

//  The stop function stops the Jeu.
Jeu.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

//  Inform the Jeu a key is down.
Jeu.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current etat too.
    if(this.currentetat() && this.currentetat().keyDown) {
        this.currentetat().keyDown(this, keyCode);
    }
};

//  Inform the Jeu a key is up.
Jeu.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current etat too.
    if(this.currentetat() && this.currentetat().keyUp) {
        this.currentetat().keyUp(this, keyCode);
    }
};

function Etatdepart() {

}

Etatdepart.prototype.enter = function(Jeu) {

    // Create and load the sounds.
    Jeu.sounds = new Sounds();
    Jeu.sounds.init();
    Jeu.sounds.loadSound('shoot', 'sounds/shoot.wav');
    Jeu.sounds.loadSound('bang', 'sounds/bang.wav');
    Jeu.sounds.loadSound('explosion', 'sounds/explosion.wav');
};

Etatdepart.prototype.update = function (Jeu, dt) {


};

Etatdepart.prototype.draw = function(Jeu, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, Jeu.width, Jeu.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Space ennemis", Jeu.width / 2, Jeu.height/2 - 40);
    ctx.font="16px Arial";

    ctx.fillText("Press 'Space' to start.", Jeu.width / 2, Jeu.height/2);
};

Etatdepart.prototype.keyDown = function(Jeu, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space starts the Jeu.
        Jeu.level = 1;
        Jeu.score = 0;
        Jeu.lives = 3;
        Jeu.moveToetat(new LevelIntroetat(Jeu.level));
    }
};

function JeuOveretat() {

}

JeuOveretat.prototype.update = function(Jeu, dt) {

};

JeuOveretat.prototype.draw = function(Jeu, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, Jeu.width, Jeu.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Jeu Over!", Jeu.width / 2, Jeu.height/2 - 40);
    ctx.font="16px Arial";
    ctx.fillText("You scored " + Jeu.score + " and got to level " + Jeu.level, Jeu.width / 2, Jeu.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Press 'Space' to play again.", Jeu.width / 2, Jeu.height/2 + 40);
};

JeuOveretat.prototype.keyDown = function(Jeu, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space restarts the Jeu.
        Jeu.lives = 3;
        Jeu.score = 0;
        Jeu.level = 1;
        Jeu.moveToetat(new LevelIntroetat(1));
    }
};

//  Create a Playetat with the Jeu config and the level you are on.
function Playetat(config, level) {
    this.config = config;
    this.level = level;

    //  Jeu etat.
    this.ennemiCurrentvitesse =  10;
    this.ennemiCurrentchuteDistance =  0;
    this.ennemisArechuteping =  false;
    this.lastmissileTime = null;

    //  Jeu entities.
    this.vaisseau = null;
    this.ennemis = [];
    this.missiles = [];
    this.bombs = [];
}

Playetat.prototype.enter = function(Jeu) {

    //  Create the vaisseau.
    this.vaisseau = new vaisseau(Jeu.width / 2, Jeu.Jeulimites.bottom);

    //  Setup initial etat.
    this.ennemiCurrentvitesse =  10;
    this.ennemiCurrentchuteDistance =  0;
    this.ennemisArechuteping =  false;

    //  Set the vaisseau vitesse for this level, as well as ennemi params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.vaisseauvitesse = this.config.vaisseauvitesse;
    this.ennemiInitialvitesse = this.config.ennemiInitialvitesse + (levelMultiplier * this.config.ennemiInitialvitesse);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.vitesse = this.config.vitesse + (levelMultiplier * this.config.vitesse);
    this.bombMaxvitesse = this.config.bombMaxvitesse + (levelMultiplier * this.config.bombMaxvitesse);

    //  Create the ennemis.
    var ranks = this.config.ennemiRanks;
    var files = this.config.ennemiFiles;
    var ennemis = [];
    for(var rank = 0; rank < ranks; rank++){
        for(var file = 0; file < files; file++) {
            ennemis.push(new ennemi(
                (Jeu.width / 2) + ((files/2 - file) * 200 / files),
                (Jeu.Jeulimites.top + rank * 20),
                rank, file, 'ennemi'));
        }
    }
    this.ennemis = ennemis;
    this.ennemiCurrentvitesse = this.ennemiInitialvitesse;
    this.ennemivitesse = {x: -this.ennemiInitialvitesse, y:0};
    this.ennemiNextvitesse = null;
};

Playetat.prototype.update = function(Jeu, dt) {

    //  If the left or right arrow keys are pressed, move
    //  the vaisseau. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the vaisseau would move
    //  more like a text editor caret.
    if(Jeu.pressedKeys[37]) {
        this.vaisseau.x -= this.vaisseauvitesse * dt;
    }
    if(Jeu.pressedKeys[39]) {
        this.vaisseau.x += this.vaisseauvitesse * dt;
    }
    if(Jeu.pressedKeys[32]) {
        this.firemissile();
    }

    //  Keep the vaisseau in limites.
    if(this.vaisseau.x < Jeu.Jeulimites.left) {
        this.vaisseau.x = Jeu.Jeulimites.left;
    }
    if(this.vaisseau.x > Jeu.Jeulimites.right) {
        this.vaisseau.x = Jeu.Jeulimites.right;
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
        if(hitLeft == false && newx < Jeu.Jeulimites.left) {
            hitLeft = true;
        }
        else if(hitRight == false && newx > Jeu.Jeulimites.right) {
            hitRight = true;
        }
        else if(hitBottom == false && newy > Jeu.Jeulimites.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            ennemi.x = newx;
            ennemi.y = newy;
        }
    }

    //  Update ennemi velocities.
    if(this.ennemisArechuteping) {
        this.ennemiCurrentchuteDistance += this.ennemivitesse.y * dt;
        if(this.ennemiCurrentchuteDistance >= this.config.ennemichuteDistance) {
            this.ennemisArechuteping = false;
            this.ennemivitesse = this.ennemiNextvitesse;
            this.ennemiCurrentchuteDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) {
        this.ennemiCurrentvitesse += this.config.ennemiAcceleration;
        this.ennemivitesse = {x: 0, y:this.ennemiCurrentvitesse };
        this.ennemisArechuteping = true;
        this.ennemiNextvitesse = {x: this.ennemiCurrentvitesse , y:0};
    }
    //  If we've hit the right, move down then left.
    if(hitRight) {
        this.ennemiCurrentvitesse += this.config.ennemiAcceleration;
        this.ennemivitesse = {x: 0, y:this.ennemiCurrentvitesse };
        this.ennemisArechuteping = true;
        this.ennemiNextvitesse = {x: -this.ennemiCurrentvitesse , y:0};
    }
    //  If we've hit the bottom, it's Jeu over.
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
                Jeu.score += this.config.pointsPerennemi;
                break;
            }
        }
        if(bang) {
            this.ennemis.splice(i--, 1);
            Jeu.sounds.playSound('bang');
        }
    }

    //  Find all of the front rank ennemis.
    var frontRankennemis = {};
    for(var i=0; i<this.ennemis.length; i++) {
        var ennemi = this.ennemis[i];
        //  If we have no ennemi for Jeu file, or the ennemi
        //  for Jeu file is futher behind, set the front
        //  rank ennemi to Jeu one.
        if(!frontRankennemis[ennemi.file] || frontRankennemis[ennemi.file].rank < ennemi.rank) {
            frontRankennemis[ennemi.file] = ennemi;
        }
    }

    //  Give each front rank ennemi a chance to chute a bomb.
    for(var i=0; i<this.config.ennemiFiles; i++) {
        var ennemi = frontRankennemis[i];
        if(!ennemi) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) {
            //  Fire!
            this.bombs.push(new Bomb(ennemi.x, ennemi.y + ennemi.height / 2,
                this.vitesse + Math.random()*(this.bombMaxvitesse - this.vitesse)));
        }
    }

    //  Check for bomb/vaisseau collisions.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        if(bomb.x >= (this.vaisseau.x - this.vaisseau.width/2) && bomb.x <= (this.vaisseau.x + this.vaisseau.width/2) &&
            bomb.y >= (this.vaisseau.y - this.vaisseau.height/2) && bomb.y <= (this.vaisseau.y + this.vaisseau.height/2)) {
            this.bombs.splice(i--, 1);
            Jeu.lives--;
            Jeu.sounds.playSound('explosion');
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
            Jeu.lives = 0;
            Jeu.sounds.playSound('explosion');
        }
    }

    //  Check for failure
    if(Jeu.lives <= 0) {
        Jeu.moveToetat(new JeuOveretat());
    }

    //  Check for victory
    if(this.ennemis.length === 0) {
        Jeu.score += this.level * 50;
        Jeu.level += 1;
        Jeu.moveToetat(new LevelIntroetat(Jeu.level));
    }
};

Playetat.prototype.draw = function(Jeu, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, Jeu.width, Jeu.height);

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
    var textYpos = Jeu.Jeulimites.bottom + ((Jeu.height - Jeu.Jeulimites.bottom) / 2) + 14/2;
    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    var info = "Lives: " + Jeu.lives;
    ctx.textAlign = "left";
    ctx.fillText(info, Jeu.Jeulimites.left, textYpos);
    info = "Score: " + Jeu.score + ", Level: " + Jeu.level;
    ctx.textAlign = "right";
    ctx.fillText(info, Jeu.Jeulimites.right, textYpos);

    //  If we're in debug mode, draw limites.
    if(this.config.debugMode) {
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(0,0,Jeu.width, Jeu.height);
        ctx.strokeRect(Jeu.Jeulimites.left, Jeu.Jeulimites.top,
            Jeu.Jeulimites.right - Jeu.Jeulimites.left,
            Jeu.Jeulimites.bottom - Jeu.Jeulimites.top);
    }

};

Playetat.prototype.keyDown = function(Jeu, keyCode) {

    if(keyCode == 32) {
        //  Fire!
        this.firemissile();
    }
    if(keyCode == 80) {
        //  Push the pause etat.
        Jeu.pushetat(new Pauseetat());
    }
};

Playetat.prototype.keyUp = function(Jeu, keyCode) {

};

Playetat.prototype.firemissile = function() {
    //  If we have no last missile time, or the last missile time
    //  is older than the max missile rate, we can fire.
    if(this.lastmissileTime === null || ((new Date()).valueOf() - this.lastmissileTime) > (1000 / this.config.missilevitmax))
    {
        //  Add a missile.
        this.missiles.push(new missile(this.vaisseau.x, this.vaisseau.y - 12, this.config.missilevitesse));
        this.lastmissileTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        Jeu.sounds.playSound('shoot');
    }
};

function Pauseetat() {

}

Pauseetat.prototype.keyDown = function(Jeu, keyCode) {

    if(keyCode == 80) {
        //  Pop the pause etat.
        Jeu.popetat();
    }
};

Pauseetat.prototype.draw = function(Jeu, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, Jeu.width, Jeu.height);

    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Paused", Jeu.width / 2, Jeu.height/2);
    return;
};

/*
 Level Intro etat

 The Level Intro etat shows a 'Level X' message and
 a countdown for the level.
 */
function LevelIntroetat(level) {
    this.level = level;
    this.countdownMessage = "3";
}

LevelIntroetat.prototype.update = function(Jeu, dt) {

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
        //  Move to the next level, popping this etat.
        Jeu.moveToetat(new Playetat(Jeu.config, this.level));
    }

};

LevelIntroetat.prototype.draw = function(Jeu, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, Jeu.width, Jeu.height);

    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Level " + this.level, Jeu.width / 2, Jeu.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Ready in " + this.countdownMessage, Jeu.width / 2, Jeu.height/2 + 36);
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

 Fired by the vaisseau, they've got a position, vitesse and etat.

 */
function missile(x, y, vitesse) {
    this.x = x;
    this.y = y;
    this.vitesse = vitesse;
}

/*
 Bomb

 chuteped by ennemis, they've got position, vitesse.

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
 Jeu etat

 A Jeu etat is simply an update and draw proc.
 When a Jeu is in the etat, the update and draw procs are
 called, with a dt value (dt is delta time, i.e. the number)
 of seconds to update or draw).

 */
function Jeuetat(updateProc, drawProc, keyDown, keyUp, enter, leave) {
    this.updateProc = updateProc;
    this.drawProc = drawProc;
    this.keyDown = keyDown;
    this.keyUp = keyUp;
    this.enter = enter;
    this.leave = leave;
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
