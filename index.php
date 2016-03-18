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
        <a id="envoyerScore" class="btn btn-default btn-lg active" role="button" href="">Enregistrer votre score</a>
        </div>
        <div id="info">
            <h4>Bougez avec les fléches directionnelles, Tirez avec la barre d'Espace, Les envahisseurs accélérent leur cadence de tir au fur et à mesure </h4>
            <h4>Appuyez sur P pour mettre le jeu en pause.</h4>
            <h2><a id="muteLink" href="#" onclick="toggleMute()"><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span></a> 
                <a href="add_vote.php?pseudo=<?php echo ''.$_SESSION['pseudo'].''?>"><span class="glyphicon glyphicon-heart" aria-hidden="true" style="color: red;"></span></a> <?php echo '' . $votes['countid'] . ''; ?></h2> 
                <p>(Vous devez être inscrit et connecter !)</p>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_donations">
<input type="hidden" name="business" value="hugo.leroux33@gmail.com">
<input type="hidden" name="lc" value="FR">
<input type="hidden" name="item_name" value="QLF Invader">
<input type="hidden" name="no_note" value="0">
<input type="hidden" name="currency_code" value="EUR">
<input type="hidden" name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest">
<input type="image" src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne">
<img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1">
</form>

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

    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>