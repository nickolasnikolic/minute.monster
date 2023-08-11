const express = require('express')
const hbs = require('hbs')
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('game.db')
const app = express()
app.set('view engine', 'hbs')

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
    viewData.documentNumber = Math.round((Math.random() * 10000) + 9999)
    viewData.target = `https://www.federalregister.gov/api/v1/documents/${(new Date.getFullYear() - 1)}-${viewData.documentNumber}.json?fields[]=abstract`
    
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
                //write to db // 
                var sql = `insert into contests values (${null}, ${Date.getFullYear() - 1}, ${viewData.documentNumber} )`
                await db.run(sql)
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