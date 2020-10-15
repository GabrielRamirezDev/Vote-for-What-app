const User = require("../app/models/user.js")
const Ballot = require("../app/models/ballot.js")
const databasePromise = require("../database.js")
const accountSid = 'example';
const authToken = 'example';
const twilioClient = require('twilio')(accountSid, authToken);
console.log("Here is twilio!", twilioClient)

//1. fetch all users one page at a time
//2.look at saved queries on each user
//3.run search query for each term in query
//4. check if ballots created at date, is later then the last date checked for user
//5. save the user to update the updatedAt field


const fetchUsers = async () => {
    try {
        await databasePromise
        let users = await User.find({ savedQueries: { $exists: true, $ne: [] } }).exec()
        for (const user of users) {
            for (const query of user.savedQueries) {
                console.log("checking for updatedAt", user.lastChecked)
                if (!user.lastChecked) {
                    continue
                }
                const dateQuery = { createdAt: { $gt: new Date(user.lastChecked) }, $and: [{ $text: { $search: query } }] }

                const ballots = await Ballot.find(dateQuery).exec()
                console.log("finding ballots by dateQuery", ballots.length)
                if (ballots.length > 0) {
                    console.log("sending text to:", user.local.phone)
                    twilioClient.messages
                        .create({
                            body: 'Vote for What? - A new ballot has appeared in your search! Login to flex your voting power.',
                            from: '+12055193959',
                            to: "+1" + user.local.phone
                        })
                        .then(message => console.log("sid is ...", message.sid))
                        .catch(err => console.log("oh no twilio failed!", err));
                    console.log('finished sending text!')
                }

            }
            user.lastChecked = new Date()
            console.log("about to save user");
            await user.save()
        }
    } catch (err) {
        console.log("fetchUsers error", err.message)

    }
}
fetchUsers().then(() => {
    // process.exit(0)
})