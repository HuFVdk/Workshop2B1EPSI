<?php session_start (); ?>
<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.php'); ?>

    <div class="heading">
        <h2><strong>Erreur</strong></h2>
        <p>Oops !</p>
    </div>
  		<div class="tab">
    		<div class="alert alert-danger" id="score" role="alert">Ce n'est pas ton meilleur score !</div>
    		<div class="alert alert-danger" id="input" role="alert">Un champ du formulaire n'est pas remplis !</div>
    		<div class="alert alert-danger" id="username" role="alert">Ce pseudo est déjà utilisé !</div>
    		<div class="alert alert-danger" id="login" role="alert">Identifiant ou mot de passe incorrecte</div>
    		<div class="alert alert-danger" id="connection" role="alert">Vous devez être connecter</div>
    		<div class="alert alert-danger" id="vote" role="alert">Vous avez déjà voter !</div>
    	</div>
    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>