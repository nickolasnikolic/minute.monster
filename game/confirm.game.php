<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>minute.monster game</title>
    <link href="./assets/fonts/stylesheet.css" rel="stylesheet" />
    <link href="./assets/css/main.css" rel="stylesheet" />
</head>
<body>
    <div id="gameOver">
        <?php if (isset($wins)): ?>
            <h1 class="title">You Win!!! <span class="minutemonster"></span>Minute.Monster</span> Didn't get you!!!!</h1>
        
        <?php else: ?>
            <h1 class="title">The <span class="minutemonster"></span>Minute.Monster</span> GOT YOU!!!!</h1>
            <h2 class="title">Sorry, Game Over :-(</h2>
        <?php endif; ?>
        <p>You successfully assembled a healthy day of calories!!!</p>
        <ul>
        <?php if (isset( $tally )): ?>
            <?php foreach ($variable as $key => $value): ?>
                <li id="<?= $key ?>"><?= $key ?>: <strong><?= $value ?></strong></li>
            <?php endforeach; ?>
        <?php endif; ?>
         </ul>
        <a id="playButton" href="game.php">Play Again???</a>
    </div>
</body>
</html>