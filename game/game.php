<?php
//run the game

//pack url vars into session
if (count($_GET)) {
    $_SESSION['tally'] = $_SERVER['QUERY_STRING'];
}
$randomPage = random_int(1, 300);
$_SESSION['random_int'] = $randomPage;

$target = "https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=25&pageNumber={$randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog";

$data = json_decode( file_get_contents( $target ) );

//refreshing so that another random page may work
//be sure to acknowledge query for past turns
if(isset($_SESSION['tally'])){
    $urlRequest = `?`;
    foreach($_SESSION['tally'] as $key => $value){
        $urlRequest .= "&{$key}={$value}";
    }
    header( "location:{$urlRequest}" );
    exit;
}
?>

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
    <header>
        <h1 class="title">The <span class="minutemonster"></span>Minute.Monster</span> Game!</h1>
    </header>
    <div class="grid">
        <section id="display">
                <?php foreach( $foods as $food ): ?>
                    <?php if( $food['description']): ?>
                <article>
                    <div class="swivel">
                        <h2><?= $food['brandOwner'] ? $food['brandOwner'] : 'Generic'; ?></h2>
                        <h3><?= $food['description'] ?></h3>
                        <p>UPC: <?= $food['gtinUpc'] ?></p>
                        <ul>
                            <?php foreach( $food->foodNutrients as $nutrient): ?>
                                <li><strong><?= $nutrient->name; ?></strong>: <?= $nutrient->amount; ?> in <?= $nutrient->unitName; ?></li>
                            <?php endforeach; ?>
                        </ul>
                        <button 

                            class="select"
                            data-fdcId="<?= $food->fdcId; ?>"
                            data-name="<?= $food->description; ?>"
                            <?php foreach( $food->foodNutrients as $nutrient): ?>
                                data-nutrient-<?= $index ?>='{"name":"<?= $nutrient->name; ?>", "amount":<?= $nutrient->amount; ?>, "unit":"<?= $nutrient->unitName; ?>" }'
                            <?php endforeach; ?>

                            >Select Me!</button>
                    </div>
                </article>
                    <?php endif; ?>
                <?php endforeach; ?>
        </section>
    </div>
    <div id="gameOver">
        <?php if (isset($_SESSION['wins'])): ?>
            <h1 class="title">You Win!!! <span class="minutemonster"></span>Minute.Monster</span> Did not get you!!!!</h1>
            <p>You successfully assembled a health day of calories. Specifics</p>
        <?php else: ?>
            <h1 class="title">The <span class="minutemonster"></span>Minute.Monster</span> GOT YOU!!!!</h1>
            <h2 class="title">Sorry, Game Over :-(</h2>
        <?php endif; ?>
         <a id="playButton" href="./game.php">Play Again???</a>
         <article></article>
    </div>
    <footer>
        <section>
            <div id="clock">
                <h2>Clock</h2>
            </div>
            <article id="food">
                    <h2>Minute.Monster Shopping List:</h2>
                    <ul>
                        <li id="calories">Total Calorie Count (enough of, but not too much!!! (2500 calories)): <strong><?= $_SESSION['calories'] ?></strong> calories</li>
                        <li id="carbs">Total Carbohydrates (enough of): <strong><?= $_SESSION['carbs'] ?></strong> grams</li>
                        <li id="calcium">Total Calcium (enough of): <strong><?= $_SESSION['calcium'] ?></strong> grams</li>
                        <li id="protein">Total Protein (enough of): <strong><?= $_SESSION['protein'] ?></strong> grams</li>
                        <li id="fiber">Total Fiber (enough of): <strong><?= $_SESSION['fiber'] ?></strong> grams</li>
                        <li id="vitamins">Total Vitamins By Mass (most of): <strong><?= $_SESSION['vitamins'] ?></strong> grams</li>
                        <li id="sodium">Total Sodium (less of): <strong><?= $_SESSION['sodium'] ?></strong> grams</li>
                        <li id="cholesterol">Total Cholesterol (least of): <strong><?= $_SESSION['cholesterol'] ?></strong> grams</li>
                        <li id="fats">Total Fats (least of): <strong><?= $_SESSION['fats'] ?></strong> grams</li>
                        <button id="getMore">get more foods and time</button>
                    </ul>
            </article>
        </section>
    </footer>
    <script src="./assets/js/game.js" ></script>
</body>
</html>