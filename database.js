
const mongoose = require("mongoose");
const configDB = require('./config/database.js');
module.exports = new Promise(function (resolve, reject) {
    let options = {
        bufferCommands: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    // connect to our database
    mongoose.connect(configDB.url, options, (err, database) => {
        console.log("were connected!!")
        if (err) {
            console.log("failed to connect", err.message)
            return reject(err)
        }
        resolve(database)
    });
});
