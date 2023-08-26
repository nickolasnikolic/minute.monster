const express = require('express')
const hbs = require('hbs')
const hsc = require('htmlspecialchars')
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('game.db')
const app = express()
app.set('view engine', 'hbs')

//api key
const apiKey = "yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog"

app.use('/assets', express.static(__dirname + '/assets'))

//include a class
app.get('/registration', (req, res) => {
    res.render('registration')
})
//accept a class
app.post('/registration', (req, res) => {
    var sql = `insert into classes values (${req.params.name})`
    db.run(sql, (results) => {
        res.redirect('/class')
    })
})

//get included classes
app.get('/class', (req, res) => {
    var sql = `select * from classes`
    db.run(sql, (results) => {
        console.log(results)
        res.render('class', results)
    })
})

//run the game
app.get('/game', async (req, res) => {
    var viewData = {};

    var randomPage = Math.round((3 + (Math.random() * 100)))
    
    viewData.target = `https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=20&pageNumber=${randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog`
    
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
                console.log(data);
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

app.post('/game', async (req, res) => {
    var answersGiven = req.params
    var answersSql = `select * from contests where id = ${answersGiven.id};`

    await db.run(answersSql, (results) => {
        console.log(results)
        res.render('gameAnswered', results)   
    })
})

app.get('/',(req, res)=>{
    res.render('index')
})

app.listen(5000)