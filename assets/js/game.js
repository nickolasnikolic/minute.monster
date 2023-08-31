window.onload = () => {
    var timerElement = document.querySelector('#clock')
    var element = document.createElement('p')
    timerElement.appendChild(element)
    //throtttle clock
    var timeAlloted=new Date(Date.now() + (1000 * 60 * 3))
    var countDown = 60 //1min
    function updateClock(){
        if(Date.now() < timeAlloted){ 
            if (Date.now() % 1000 == 0) {
                //game end by time
                if(countDown > 0)
                   element.innerText = countDown--
                }else{
                    minuteMonsterEndGame()
                }
        }
        requestAnimationFrame(updateClock)
    }
    updateClock()

    //log selections
    var tally = {}

    //if there is a query string set
    if (location.search != undefined){

        params = new URLSearchParams(location.search)

        tally.turn = 0 || Number(params.get("turn"))
        tally.calories = 0 || Number(params.get("calories"))
        tally.carbs = 0 || Number(params.get("carbs"))
        tally.calcium = 0 || Number(params.get("calcium"))
        tally.protein = 0 || Number(params.get("protein"))
        tally.vitamins = 0 || Number(params.get("vitamins"))
        tally.sodium = 0 || Number(params.get("sodium"))
        tally.cholesterol = 0 || Number(params.get("cholesterol"))
        tally.fiber = 0 || Number(params.get("fiber"))
        tally.fats = 0 || Number(params.get("fats"))
    } else {
        tally.turn = 0
        tally.calories = 0
        tally.carbs = 0
        tally.calcium = 0
        tally.protein = 0
        tally.vitamins = 0
        tally.sodium = 0
        tally.cholesterol = 0
        tally.fiber = 0
        tally.fats = 0
    }

    var maxCalories = 2500
    var buttons = document.querySelectorAll('button.select')
    var buttons = Array.from(buttons)
    //on click of a buttton in the set
    buttons.forEach((el) => {
        el.addEventListener('click', (e) => {
            excite(e.target.parentNode)
            //mark a turn taken
            tally.turn++
            //get at calorie attribute
            var attributes = Array.from(e.target.attributes)
            attributes.forEach((attribute, index) => {
                //avoid pesky data
                if (attribute.name == 'class' || attribute.name == 'data-name' || attribute.name == 'data-fdcid') {
                    console.log('rejecting, first:', index, attribute.name);
                } else {
                    //add the total calorie count to the list
                    if(attribute.name == 'data-nutrient-3'){
                        //found it!
                        var calorie = JSON.parse(attribute.value)
                        //make sure that it's under maxCalories
                        //game end by rules
                        if(calorie.amount < maxCalories && tally.calories < maxCalories && calorie.name == 'Energy'){
                            //add the food 
                            tally.calories += Math.ceil(Number(calorie.amount))
                            document.querySelector('#calories strong').innerText = tally.calories
                            minuteMonsterPop(document.querySelector('#calories strong'))
                        }else{
                            minuteMonsterEndGame()
                        }
                    //if the data is just the USDA serial number
                    //ignore it
                    }else if(/\d{6,10}/.test(attribute.value)){
                        console.log('rejecting, final:', index, attribute.name)
                    }else{
                        //otherwise, tally the nutrition
                        var nutrient = JSON.parse(String(attribute.value))
                        console.log('logging:', index, nutrient);

                        //make sure the amount of nutrient is a number
                        nutrient.amount = Number(nutrient.amount)

                        if(nutrient.unit == "MG"){
                            nutrient.amount = nutrient.amount/1000
                        }
                        switch (nutrient.name) {
                            case 'Protein':
                                tally.protein += nutrient.amount
                                document.querySelector('#protein strong').innerText = tally.protein.toFixed(3)
                                minuteMonsterPop(document.querySelector('#protein strong'))
                                break;
                            case 'Calcium, Ca':
                                tally.calcium += nutrient.amount
                                document.querySelector('#calcium strong').innerText = tally.calcium.toFixed(3)
                                minuteMonsterPop(document.querySelector('#calcium strong'))
                                break;
                            case 'Total lipid (fat)':
                                tally.fats += nutrient.amount
                                document.querySelector('#fats strong').innerText = tally.fats.toFixed(3)
                                minuteMonsterPop(document.querySelector('#fats strong'))
                                break;
                            case 'Carbohydrate, by difference':
                            case 'Sugars, total including NLEA':
                            case 'Sugars, added':
                                tally.carbs += nutrient.amount
                                document.querySelector('#carbs strong').innerText = tally.carbs.toFixed(3)
                                minuteMonsterPop(document.querySelector('#carbs strong'))
                                break;
                            case 'Fiber, total dietary':
                                tally.fiber += nutrient.amount
                                document.querySelector('#fiber strong').innerText = tally.fiber.toFixed(3)
                                minuteMonsterPop(document.querySelector('#fiber strong'))
                                break;
                            case 'Cholesterol':
                                tally.cholesterol += nutrient.amount
                                document.querySelector('#cholesterol strong').innerText = tally.cholesterol.toFixed(3)
                                minuteMonsterPop(document.querySelector('#cholesterol strong'))
                                break;
                            case 'Sodium, Na':
                                tally.sodium += nutrient.amount
                                document.querySelector('#sodium strong').innerText = tally.sodium.toFixed(3)
                                minuteMonsterPop(document.querySelector('#sodium strong'))
                                break;
                            default:
                                tally.vitamins += nutrient.amount
                                document.querySelector('#vitamins strong').innerText = tally.vitamins.toFixed(3)
                                minuteMonsterPop(document.querySelector('#vitamins'))
                                break;
                        }
                    }
                }
            })
        })
    })

    var eatButton = document.querySelector('#food button')
    eatButton.addEventListener('click', e => {
        if(tally){
            console.log(tally)
            var url = `/game`
            url += `?`
            for(var [key, value] of Object.entries(tally)){
                url += `&${key}=${value}`
            }
         }
        location.assign(url)
        })
    

    function excite(element) {
        element.classList.toggle('excite')
        setTimeout(() => {
            element.classList.toggle('excite')
        }, 500);        
    }
    function minuteMonsterPop(element) {
        element.classList.toggle('minutemonster')
        setTimeout(() => {
            element.classList.toggle('minutemonster')
        }, 500);        
    }
    function minuteMonsterEndGame(){
        //alert("You're not a winner!, but try, try, again!")
        console.log('game over')
    }
}