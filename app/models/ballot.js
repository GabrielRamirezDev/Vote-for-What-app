// load the things we need
var mongoose = require('mongoose');

// define the schema for our ballot model
var ballotSchema = mongoose.Schema({
    district_name: String,
    district_type: String,
    yes_vote: { type: String, index: true },
    no_vote: { type: String, index: true },
    summary: { type: String, index: true },
    official_title: String,
    status: String
}, { collection: "ballot_measures", timestamps: true });


// create the model for ballots and expose it to our app
module.exports = mongoose.model('BallotMeasure', ballotSchema);
