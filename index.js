const express = require('express')
const hbs = require('hbs')
const app = express()
app.set('view engine', 'hbs')
app.set("views", (__dirname + "views"))
app.use('/assets', express.static(__dirname + '/assets'))

//run the game
app.get('/game', async (req, res) => {
    var viewData = {};
    if (req.query) {
        viewData.tally = req.query
    }
    viewData.randomPage = Math.round((1 + (Math.random() * 300)))
    
    viewData.target = `https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded&pageSize=25&pageNumber=${viewData.randomPage}&api_key=yC2ygW8UjAfcr27AeQiadCKV09hKfo5PvLOcyVog`
    
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
        }else if(data.status == 500){
             //refreshing so that another random page may work
             var url = `/game`
             //be sure to acknowledge query for past turns
             if(viewData.tally){
                url += `?`
                for(var [key, value] of Object.entries(viewData.tally)){
                    url += `&${key}=${value}`
                }
             }
            res.redirect(url)
        }
        else{
                viewData = {...viewData, ...data}
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

app.get('/confirm', (req, res) => {
    var viewData = {}
    viewData.wins = req.query.wins
    viewData.tally = req.query

    var maxCalories = Number(viewData.tally.maxCalories)
    var caloriesCollected = Number(viewData.tally.calories)

    var ratingDifference = Math.abs( maxCalories - caloriesCollected)
    //check a ratio against deverse nutrients and average them
    //leaving off the last win value for rating
    var totalToAverage = 0
    var rolodex = Object.values(viewData.tally)
    var filteredValues = rolodex.filter(e => e != 'true' && e != 2500)
    for ( var index = filteredValues.length - 1; index > 0; index--) {
        var v = Math.round(filteredValues[index])
        totalToAverage = totalToAverage + ( v / (ratingDifference + 1))
    }
    
    viewData.rating = (totalToAverage / (filteredValues.length + viewData.tally.turns)) - viewData.tally.sodium

    res.render('confirm', viewData)
})

app.get('/',(req, res)=>{
    res.render('index')
})

app.listen(8080)