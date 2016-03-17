<?php
//Connexion a la BDD
include "includes/db_connect.php";

if (isset($_POST['username']) && isset($_POST['password'])) {

// Vérification des identifiants
$req = $bdd->prepare('SELECT util_id, util_pseudo FROM utilisateur WHERE util_pseudo = :pseudo AND util_mdp = :pass');
$req->execute(array(
    'pseudo' => $_POST['username'],
    'pass' => sha1($_POST['password'])
    ));

$resultat = $req->fetch();

if ($resultat)
{
    session_start();
    $_SESSION['id'] = $resultat['util_id'];
    $_SESSION['pseudo'] = $resultat['util_pseudo'];
    header('Location: index.php');
}
else
{
    echo 'Mauvais identifiant ou mot de passe !';
}
}

//Si les champs ne sont pas remplis alors on affiche un message d'erreur
else {
  header('Location: error2.php');
}
?>