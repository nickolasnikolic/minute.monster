<?php

class App{
    static $views = [
        '/' => 'views/index.hbs.php',
        '/game' => 'views/game.hbs.php',
        '/confirm' => 'views/confirm.hbs.php',
        '/minute.monster' => 'views/index.hbs.php',
        '/minute.monster/game' => 'views/game.hbs.php',
        '/minute.monster/confirm' => 'views/confirm.hbs.php',
    ];

    static $tally = '';
    static $abstract = '';
    static $randomPage = '';
    static $target = '';
    static $data = '';
        
    static function get($route, $next){
        session_start();
        //start cache
        ob_start();
        //collect the path to load
        //load the view path
        if(isset(self::$views[$route]) && isset(self::$tally )){

            $template = self::$views[ $route ];
            include_once $template;
        }
        $next();
        ob_flush();
    }

}

//load home
App::get('/', function(){});

//run the game
App::get('/game', function(){
    if (count($_GET)) {
        $_SESSION['tally'] = $_GET;
    }
    App::$randomPage = random_int(1, 300);
    $_SESSION['random_int'] = App::$randomPage;
    $randomPage = App::$randomPage;

    App::$target = "https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=25&pageNumber={$randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog";
    
    App::$data = json_decode( file_get_contents( App::$target ) );

    $_SESSION['data'] = App::$data;
    
    if(isset(App::$data)){ 
        //refreshing so that another random page may work
        //be sure to acknowledge query for past turns
        if($_SESSION['tally']){
            $urlRequest .= `?`;
            foreach($_SESSION['tally'] as $key => $value){
                $urlRequest .= "&{$key}={$value}";
            }
        }
        header( $urlRequest );
    }
});

App::get('/confirm', function(){
    $_SESSION['wins'] = $_GET['wins'];
    $_SESSION['tally'] = $_GET;
});
