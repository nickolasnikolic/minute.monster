const express = require('express')
const hbs = require('hbs')
const hsc = require('htmlspecialchars')
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('game.db')
const app = express()
app.set('view engine', 'hbs')

app.use('/assets', express.static(__dirname + '/assets'))

//view high scores
app.get('/highscore', (req, res) => {
    var sql = 'select * from highscores order by score desc;'

    db.run(sql, (results) => {
        console.log(results)
        res.render('highscores', results)   
    })
})

//check high scores
app.post('/highscorenotify', (req, res) => {
    var sql = 'select * from highscores order by score desc;' //todo compare on scoring or submittal
    db.run(sql, (results) => {
        console.log(results)
        res.render('highscorenotify', results)   
    })
})

//record high score
app.post('/highscore', (req, res) => {
    var sql = 'insert into highscores values ();' //todo insert a high score
    // db.run(sql, (results) => {
    //     console.log(results)
    //     res.render('highscore', results)   
    // })
    res.render('highscore')
})

//run the game
app.get('/game', async (req, res) => {
    var viewData = {};
    if (req.query) {
        viewData.tally = req.query
    }
    viewData.randomPage = Math.round((1 + (Math.random() * 10000)))
    
    viewData.target = `https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=20&pageNumber=${viewData.randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog`
    
    await fetch(viewData.target)
    .then((response) => { 
        if (response.status == 404) {
            throw Error('document not found')
        }
        return response.json()
    })
    .then(async (data) => {
        //if not found to be a document
        if (data.status == 404) {
            viewData.abstract = "Please retry the game, there was an error"
        }else{
            viewData = data
                res.render('game', viewData)
            }
            
        })
        .catch((error) => {
            console.log(error)
            viewData.data = {}
            viewData.abstract = 'Could not find data; some error occurred. Please reload.'
            res.render('game', viewData)
        })
    })

app.get('/',(req, res)=>{
    res.render('index')
})

app.listen(5000)