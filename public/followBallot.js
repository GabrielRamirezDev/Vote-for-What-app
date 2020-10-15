const followBallot = document.querySelector("#followBallot");

followBallot.addEventListener('click', (event) => {
    let id = followBallot.dataset.id
    console.log(id)
    fetch('/followBallot', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'ballotId': id
        })
    })
        .then(function (response) {
        })

})

