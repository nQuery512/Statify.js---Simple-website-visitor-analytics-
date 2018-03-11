// Visitor info send by the tracker

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var visitorSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    query: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
    }
});

visitorSchema.statics.store = function (data) {
    var test = {
        query: data.query,
        city: data.city,
        country: data.country,
        referrer: data.referrer
    }
    return test;
}

module.exports = mongoose.model('Visitor', visitorSchema);
