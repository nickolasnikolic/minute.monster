<?php

class App{
    static $views = [
        '/' => 'views/index.hbs.php',
        '/game' => 'views/game.hbs.php',
        '/confirm' => 'views/confirm.hbs.php',
        'minute.monster/' => 'views/index.hbs.php',
        'minute.monster/game' => 'views/game.hbs.php',
        'minute.monster/confirm' => 'views/confirm.hbs.php',
    ];

    static $tally = '';
    static $abstract = '';
    static $randomPage = '';
    static $target = '';
    static $data = '';
        
    static function get($route, $next){
        //start cache
        ob_start();
        //collect the path to load
        //load the view path
        if(isset(self::$views[$route]) && isset(self::$tally ) || self::$tally != 0 ){

            list($templateData) = self::$tally;
            var_dump($templateData);
            $template = self::$views[ $route ];
            include $template;
            $next();
        }
        ob_flush();
    }

}

//load home
App::get('/', function(){});

//run the game
App::get('/game', function(){
    
    if (count($_GET)) {
        App::$tally = $_GET;
    }
    App::$randomPage = random_int(1, 350);
    $randomPage = App::$randomPage;

    App::$target = "https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=25&pageNumber={$randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog";
    
    App::$data = json_decode( file_get_contents( App::$target ) );

    if(isset(App::$data)){ 
        var_dump(App::$data);
        //if not found to be a document 
        if (App::$data['status'] == 404 || App::$data['status'] == 500) {
            App::$abstract = "Please retry the game";
    
            //refreshing so that another random page may work
            
            //be sure to acknowledge query for past turns
            if(App::$tally){
                $urlRequest .= `?`;
                foreach(App::$tally as $key => $value){
                    $urlRequest .= "&{$key}={$value}";
                }
            }
            redirect( $urlRequestl );
        }
       
    }
});
/*
App::get('/confirm', function(){
    $viewData = new Object();
    App::$requestData->wins = $_GET['wins'];
    App::$requestData->tally = $_GET;

    $maxCalories = Number(App::$requestData->tally.maxCalories)
    $caloriesCollected = Number(App::$requestData->tally.calories)

    $ratingDifference = Math.abs( maxCalories - caloriesCollected)
    //check a ratio against deverse nutrients and average them
    //leaving off the last win value for rating
    $totalToAverage = 0
    $rolodex = Object.values(App::$requestData->tally)
    $filteredValues = rolodex.filter(e => e != 'true' && e != 2500)
    for ( $index = filteredValues.length - 1; index > 0; index--) {
        $v = Math.round(filteredValues[index])
        totalToAverage = totalToAverage + ( $v / (ratingDifference + 1))
    }
    
    App::$requestData->rating = (totalToAverage / (filteredValues.length + App::$requestData->tally.turns)) - App::$requestData->tally.sodium

    res.render('confirm', viewData)
})
*/