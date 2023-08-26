window.onload = () => {
    //on load flip the rotation on random articles
    //set timekeeper
    const clock = new Date()
    var timerElement = document.getElementById('clock')
    var element = document.createElement('p')
    timerElement.appendChild(element)
    function updateClock(e){
        element.innerHTML = String(Date.now())
        requestAnimationFrame(updateClock)
    }
    updateClock()
    //log selections
    var buttons = document.querySelectorAll('button.select')
    buttons.forEach((element, index) => {
        element.addEventListener('click', (e) => {
            console.log(e);
        })
    })

    //
}