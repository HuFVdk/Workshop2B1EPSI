<?php session_start (); ?>
<?php include('includes/header.html'); ?>

    <div class="container">

      <?php include('includes/navbar.php'); ?>

    <div class="heading">
        <h2><strong><?php echo ''.$_SESSION['pseudo'].''?></strong></h2>
        <p>Votre tableau de bord</p>
    </div>

      <h1>Votre meilleur score est de:</h1>

    </div>

    </div> <!-- /container -->
<?php include('includes/footer.html'); ?>