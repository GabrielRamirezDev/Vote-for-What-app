const saveNotification = document.querySelector("#saveNotification");
const searchInput = document.querySelector("#searchInput");
const locationInput = document.querySelector("#locationInput");
const submitBtn = document.querySelector("#submitBtn");
const searchUl = document.querySelector("#searchUl");


saveNotification.addEventListener('click', (event) => {
    event.preventDefault()
    fetch('/saveNotification', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'search': searchInput.value,
            'location': locationInput.value
        })
    })
        .then(function (response) {
        })
})


submitBtn.addEventListener('click', (event) => {
    console.log("submitBtn")
    event.preventDefault()
    fetch('/search', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'search': searchInput.value,
            'location': locationInput.value
        })
    })
        .then(function (response) {
            return response.json()
        }).then(data => {
            console.log(data)
            let element = searchUl;
            while (searchUl.firstChild) {
                element.removeChild(searchUl.firstChild);
            }
            data.ballot_measures.forEach(x => {

                let official_title = document.createTextNode(x.official_title)
                let summary = document.createTextNode(x.summary)
                let district_name = document.createTextNode(x.district_name)

                let cardShadow = document.createElement("div");
                cardShadow.classList.add("card")
                cardShadow.classList.add("shadow")
                cardShadow.classList.add("mb-4")
                let cardHeader = document.createElement("div");
                cardHeader.classList.add("card-header")
                cardHeader.classList.add("py-3")

                cardShadow.appendChild(cardHeader)
                let cardH6 = document.createElement("h6");
                cardH6.classList.add("m-0")
                cardH6.classList.add("font-weight-bold")
                cardH6.classList.add("text-primary")
                let titleTxt = document.createTextNode("Title: ")
                cardH6.appendChild(titleTxt)
                cardH6.appendChild(official_title)
                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardHeader.appendChild(cardH6)
                let summaryTxt = document.createTextNode("Summary: ")
                cardBody.appendChild(summaryTxt)
                cardBody.appendChild(summary)
                cardShadow.appendChild(cardBody);
                let state = document.createElement("div")
                state.classList.add("card-body");
                let districtNameTxt = document.createTextNode("State: ")
                state.appendChild(districtNameTxt);
                state.appendChild(district_name)
                cardShadow.appendChild(state);
                //append everything to a, then append a to the li - makes everything clickable
                //create route called ballot/id and do find to database to render additional information
                let a = document.createElement("a")
                //uses mongo id in params
                a.href = `/ballotDetails/${x._id}`
                a.appendChild(cardShadow)
                searchUl.appendChild(a)
            })
        })
})

