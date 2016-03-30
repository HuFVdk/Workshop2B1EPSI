<?php
    session_start();
//Connexion a la BDD
include "includes/db_connect.php";
	
	if (isset($_SESSION['id'])) {

	$requete = $bdd->prepare('SELECT util_highscore FROM utilisateur WHERE util_id = :session_id');
	$requete->execute(array(
		'session_id' => $_SESSION['id']
		));

	while ($donnees = $requete->fetch())
	{
		if ($donnees['util_highscore'] < $_POST['score']){
			$requete2 = $bdd->prepare("UPDATE utilisateur SET util_highscore = :score, util_level = :niveau WHERE util_id = '".$_SESSION['id']."'");
    		$requete2->execute(array(
      			'score' => $_POST['score'],
      			'niveau' => $_POST['niveau']
      			));

    header('Location: index.php');

		} 
		else {
			header('Location: error.php#score');
		}
	}
}
else {
	header('Location: error.php#connection');
}
?>