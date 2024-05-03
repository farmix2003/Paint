document.addEventListener('DOMContentLoaded', () => {

    const userInput = document.querySelector('.username'),
        joinBtn = document.querySelector('.joinBtn')


    joinBtn.addEventListener('click', (event) => {
        if (userInput.value === "") {
            alert("Please enter a username")
            event.preventDefault()
        }
    })
    userInput.addEventListener('change', (e) => {

        console.log(e.target.value)
    })
})
