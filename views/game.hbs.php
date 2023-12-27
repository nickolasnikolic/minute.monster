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
                <?php if( $food->description ): ?>
            <article>
                <div class="swivel">
                    <h2><?= $food->brandOwner ? $food->brandOwner : 'Generic'; ?></h2>
                    <h3><?= $food->description ?></h3>
                    <p>UPC: <?= $food->gtinUpc ?></p>
                    <ul>
                        <?php foreach( $food->foodNutrients as $nutrient): ?>
                            <li><strong><?= $nutrient->name ?></strong>: <?= $nutrient->amount ?> in <?= $nutrient->unitName ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <button 
                        class="select"
                        data-fdcId="<?= $food->fdcId ?>"
                        data-name="<?= $food->description ?>"
                        <?php foreach( $food->foodNutrients as $nutrient): ?>
                        data-nutrient-<?= $index ?>='{"name":"<?= $nutrient->name ?>", "amount":<?= $nutrient->amount ?>, "unit":"<?= $nutrient->unitName ?>" }'
                        <?php endforeach; ?>

                        >Select Me!</button>
                </div>
            </article>
                <?php endif; ?>
                <?php endforeach; ?>
        </section>
    </div>
    <div id="gameOver">
        <?php if (isset($wins)): ?>
            <h1 class="title">You Win!!! <span class="minutemonster"></span>Minute.Monster</span> Did not get you!!!!</h1>
            <p>You successfully assembled a health day of calories. Specifics</p>
        <?php else: ?>
            <h1 class="title">The <span class="minutemonster"></span>Minute.Monster</span> GOT YOU!!!!</h1>
            <h2 class="title">Sorry, Game Over :-(</h2>
        <?php endif; ?>
         <a id="playButton" href="/game">Play Again???</a>
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
                        <li id="calories">Total Calorie Count (enough of, but not too much!!! (2500 calories)): <strong>{{tally.calories}}</strong> calories</li>
                        <li id="carbs">Total Carbohydrates (enough of): <strong>{{tally.carbs}}</strong> grams</li>
                        <li id="calcium">Total Calcium (enough of): <strong>{{tally.calcium}}</strong> grams</li>
                        <li id="protein">Total Protein (enough of): <strong>{{tally.protein}}</strong> grams</li>
                        <li id="fiber">Total Fiber (enough of): <strong>{{tally.fiber}}</strong> grams</li>
                        <li id="vitamins">Total Vitamins By Mass (most of): <strong>{{tally.vitamins}}</strong> grams</li>
                        <li id="sodium">Total Sodium (less of): <strong>{{tally.sodium}}</strong> grams</li>
                        <li id="cholesterol">Total Cholesterol (least of): <strong>{{tally.cholesterol}}</strong> grams</li>
                        <li id="fats">Total Fats (least of): <strong>{{tally.fats}}</strong> grams</li>
                        <button id="getMore">get more foods and time</button>
                    </ul>
            </article>
        </section>
    </footer>
    <script src="./assets/js/game.js" ></script>
</body>
</html>