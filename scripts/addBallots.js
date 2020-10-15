const databasePromise = require("../database.js")

const Ballot = require("../app/models/ballot.js")

const addBallots = async () => {
    try {
        await databasePromise
        const ballot = new Ballot({


            district_name: "California",
            district_type: "State",
            yes_vote: "oil oil oil",
            no_vote: "tacos for life",
            summary: "something",
            official_title: "something",
            status: "On the Ballot"

        })
        const savedBallot = await ballot.save()
        console.log("ballot was saved!", savedBallot)
    } catch (err) {
        console.log("addballot error", err.message)
    }
}
addBallots().then(() => {
    process.exit(0)
})

