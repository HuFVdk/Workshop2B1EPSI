<?php
session_start();
//Con    session_start();nexion a la BDD
include "includes/db_connect.php";

//On select les email de la table intervenant pour vérifier que l'adresse e-mail existe

        $reponse = $bdd->query("SELECT vote_ip FROM vote WHERE vote_ip = '".$_GET["ip"]."'");
        $reponse->execute();
        $donnees = $reponse->fetch();
        $reponse->closeCursor();

//Si elle existe on affiche un message d'erreur
  if ($donnees) {

      //On redirige l'intervenant en cas d'erruer
      header('Location: error1.php');
}
//Si elle n'existe pas alors on enregistre l'intervenant
    else {
    //Insertion des informations de l'intervenant
      $requete = $bdd->prepare('INSERT INTO vote(vote_ip) VALUES(:ip)');
      $requete->execute(array(
        'ip' => $_GET['ip']
        ));
        
      header('Location: index.php');
}
?>