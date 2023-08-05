const express = require('express')
const hbs = require('hbs')
const sqlite = require('sqlite3')
const db = new sqlite.Database('game')
const app = express()
app.set('view engine', 'hbs')

//include a class
app.get('/registration', async (req, res) => {
    res.render('registration')
})
//accept a class
app.post('/registration', async (req, res) => {
    var sql = `insert into classes values (${req.params.name})`
    db.run(sql, (results) => {
        res.redirect('/rooms')
    })
})

//get included classes
app.get('/rooms', async (req, res) => {
    var sql = `select * from classes`
    db.all(sql, (results) => {
        res.render('rooms', results)
    })
})

//run the game
app.get('/game', async (req, res) => {
    var viewData = {};
    viewData.documentNumber = Math.round((Math.random() * 10000) + 9999)
    viewData.target = `https://www.federalregister.gov/api/v1/documents/2023-${viewData.documentNumber}.json?fields[]=abstract`
    
    await fetch(viewData.target)
        .then((response) => { 
            if (response.status == 404) {
                throw Error('document not found')
            }
            return response.json()
        })
        .then((data) => {
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

    app.get('/',(req, res)=>{
        res.render('index')
    })

app.listen(5000)