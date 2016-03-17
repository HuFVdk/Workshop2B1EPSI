<?php
session_start();
//Con    session_start();nexion a la BDD
include "includes/db_connect.php";

//On select les email de la table intervenant pour vérifier que l'adresse e-mail existe

        $reponse = $bdd->query("SELECT vote_pseudo FROM vote WHERE vote_pseudo = '".$_GET["pseudo"]."'");
        $reponse->execute();
        $donnees = $reponse->fetch();
        $reponse->closeCursor();

//Si elle existe on affiche un message d'erreur
  if ($donnees) {

      //On redirige l'intervenant en cas d'erruer
      header('Location: error.php');
}
//Si elle n'existe pas alors on enregistre l'intervenant
    else {
    //Insertion des informations de l'intervenant
      $requete = $bdd->prepare('INSERT INTO vote(vote_pseudo) VALUES(:pseudo)');
      $requete->execute(array(
        'pseudo' => $_GET['pseudo']
        ));
        
      header('Location: index.php');
}
?>