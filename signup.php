<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.php'); ?>

    <div class="heading">
        <h2><strong>Inscription</strong></h2>
        <p>Démarrez une aventure exeptionelle !</p>
    </div>
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-8">
<form action="signup_check.php" method="POST" >
  <div class="form-group">
    <label for="username">Pseudo</label>
    <input type="text" class="form-control" id="username" name="username" placeholder="Pseudo" required>
  </div>
  <div class="form-group">
    <label for="password">Mot de passe</label>
    <input type="password" class="form-control" id="password" name="password" placeholder="Mot de passe" required>
  </div>
  <button type="submit" class="btn btn-default">Envoyer</button>
</form>
</div>
</div>

    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>