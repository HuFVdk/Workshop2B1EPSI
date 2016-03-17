<?php
//Connexion a la BDD
include "includes/db_connect.php";

if (isset($_POST['username']) && isset($_POST['password'])) {

//On select les email de la table intervenant pour vérifier que l'adresse e-mail existe

        $reponse = $bdd->query("SELECT util_pseudo FROM utilisateur WHERE util_pseudo = '".$_POST["username"]."'");
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
      $requete = $bdd->prepare('INSERT INTO utilisateur(util_pseudo, util_mdp) VALUES(:pseudo, :mdp)');
      $requete->execute(array(
        'pseudo' => $_POST['username'],
        'mdp' => sha1($_POST['password'])
        )) or die('Erreur : ' . $e->getMessage());

    session_start();
    $_SESSION['id'] = $bdd->lastInsertId();
    $_SESSION['pseudo'] = $_POST['username'];
    header('Location: index.php');
  
}
}

//Si les champs ne sont pas remplis alors on affiche un message d'erreur
else {
  header('Location: error.php');
}
?>