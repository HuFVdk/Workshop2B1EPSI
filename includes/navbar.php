      <!-- Static navbar -->
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="./">Qu'est-ce qui se passe dans l'espace !</a>
          </div>
          <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
              <li><a href="about.php">A propos</a></li>
              <li><a href="team.php">L'équipe</a></li>
            </ul>
            <?php if (isset($_SESSION['pseudo'])) { ?>
            <ul class="nav navbar-nav navbar-right">
              <li><a href="profile.php?id=<?php echo ''.$_SESSION['id'].''?>"><?php echo 'Bonjour, '.$_SESSION['pseudo'].''?></a></li>
              <li><a href="signout.php">Se deconnecter</a></li>
            </ul>
            <?php
          }
          else { ?>
            <ul class="nav navbar-nav navbar-right">
              <li><a href="signup.php">S'inscrire</a></li>
              <li><a href="signin.php">Se connecter</a></li>
            </ul>
          <?php } ?>
          </div><!--/.nav-collapse -->
        </div><!--/.container-fluid -->
      </nav>