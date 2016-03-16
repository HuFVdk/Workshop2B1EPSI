<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.html'); ?>

<div id="starfield"></div>
        <div id="gamecontainer">
        <canvas id="gameCanvas"></canvas>
        </div>
        <div id="info">
            <h4>Bougez avec les fléches directionnelles, Tirez avec la barre d'Espace, Les envahisseurs accélérent leur cadence de tir au fur et à mesure </h4>
            <h4>Appuyez sur P pour mettre le jeu en pause.</h4>
            <h2><a id="muteLink" href="#" onclick="toggleMute()"><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span></a> <a href=""><span class="glyphicon glyphicon-heart" aria-hidden="true" style="color: red;"></span></a></h2>
   
                <i class="fa fa-github fa-2x"></i> <a href="https://github.com/HuFVdk/Workshop2B1EPSI">"Qu'est ce qui se passe dans l'espace" sur Github</a> | 
                <a href="http://epsi.fr">Sponsorisé par l'EPSI,l'école d'ingénierie Informatique</a></p>
        </div>

        <script src="js/spaceinvaders.js"></script>
        <script>

            //  Initialisation de canvas
            var canvas = document.getElementById("gameCanvas");
            canvas.width = 800;
            canvas.height = 600;

            //  Crée le jeu.
            var game = new Game();

            //  Initialise le jeu
            game.initialise(canvas);

            // Lance le jeu
            game.start();

            //  Evenementielle du clavier
            window.addEventListener("keydown", function keydown(e) {
                var keycode = e.which || window.event.keycode;
                //  intégration des trois commandes (37 = Gauche,39=Droite,32=Espace)
                if(keycode == 37 || keycode == 39 || keycode == 32) {
                    e.preventDefault();
                }
                game.keyDown(keycode);
            });
            window.addEventListener("keyup", function keydown(e) {
                var keycode = e.which || window.event.keycode;
                game.keyUp(keycode);
            });
            
            function toggleMute() {
                game.mute();
                document.getElementById("muteLink").innerHTML = game.sounds.mute ? '<h2><span class="glyphicon glyphicon-volume-off" aria-hidden="true"></span></h2>' : '<h2><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span></h2>';
            }
           
        </script>
        <script type="text/javascript">


</script>

    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>