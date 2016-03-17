<?php
    session_start();
//Connexion a la BDD
include "includes/db_connect.php";

      $requete = $bdd->prepare("UPDATE utilisateur SET util_highscore = :score WHERE util_id = '".$_SESSION['id']."'");
      $requete->execute(array(
        'score' => $_GET['score'] 
        ));

      header('Location: index.php');
?>