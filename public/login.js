const loginSubmit = document.querySelector("#loginSubmit")
const loginEmail = document.querySelector("#loginEmail")
const loginPassword = document.querySelector("#loginPassword")


loginSubmit.addEventListener('click', (x) => {
    x.preventDefault();
    console.log("button clicked...default prevented...")
    let emailValue = loginEmail.value;
    console.log(emailValue)
    let loginValue = loginPassword.value
    console.log(loginValue)
    fetch('/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailValue,
            password: loginValue,
        })
    }).catch(err => {
        console.log("the error is...:", err)
    })
})

