<?php session_start (); ?>
<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.php'); 
            include "includes/db_connect.php";
      ?>

    <div class="heading">
        <h2><strong><?php echo ''.$_SESSION['pseudo'].''?></strong></h2>
        <p>Votre tableau de bord</p>
    </div>

      <table class="table"> 
        <caption><h2>Les meilleurs joueurs:</h2></caption> 
        <thead> 
          <tr>  
            <th>Pseudo</th> 
            <th>Score</th> 
        </tr> 
      </thead>
      <tbody>
          <?php
          // On récupère tout le contenu de la table jeux_video
$reponse = $bdd->query('SELECT util_pseudo, util_highscore FROM utilisateur ORDER BY util_highscore DESC');

          // On affiche chaque entrée une à une
while ($donnees = $reponse->fetch())
{
  ?>
        <tr> 
          <th><?php echo $donnees['util_pseudo']; ?></th> 
          <td><?php echo $donnees['util_highscore']; ?></td> 
        </tr> 
      </tbody> 
<?php 
}
?>
    </table>
    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>