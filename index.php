<?php session_start (); ?>
<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.php');
            include "includes/db_connect.php";

            $requete = $bdd->query ('SELECT COUNT(vote_id) AS countid FROM vote');
      
            $votes = $requete->fetch();
        ?>

<div id="starfield"></div>
        <div id="gamecontainer">
        <canvas id="gameCanvas"></canvas>
        <form method="POST" action="savescore.php">
            <input type="hidden" id="envoyerScore" name="score">
            <button type="submit" class="btn btn-default btn-lg" onclick="SaveScore()">Enregistrer mon score</button>
        </form>
        </div>
        <div id="info">
            <h4>Bougez avec les fléches directionnelles, Tirez avec la barre d'Espace, Les envahisseurs accélérent leur cadence de tir au fur et à mesure </h4>
            <h4>Appuyez sur P pour mettre le jeu en pause.</h4>
            <h2><a id="muteLink" href="#" onclick="toggleMute()"><i class="fa fa-volume-up"></i></a> 
                <a href="add_vote.php?pseudo=<?php echo ''.$_SESSION['pseudo'].''?>"><span class="glyphicon glyphicon-heart" aria-hidden="true" style="color: red;"></span></a> 
                <?php echo '' . $votes['countid'] . ''; ?></h2>
                <a href="#"><img src="pictures/icons/twitter.png"></a> <a href="#"><img src="pictures/icons/facebook.png"></a>
                <p>(Vous devez être inscrit et connecter !)</p>
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
                document.getElementById("muteLink").innerHTML = game.sounds.mute ? '<i class="fa fa-volume-off"></i>' : '<i class="fa fa-volume-up"></i>';
            }
           
        </script>

    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>