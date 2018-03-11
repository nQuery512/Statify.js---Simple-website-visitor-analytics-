// Account model file for the Statify website

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var accountSchema = new mongoose.Schema({

    account_name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    },
    website_name: {
        type: String,
        required: true
    },
    website_url: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: false
    }
});

accountSchema.statics.store = function (data) {
    var test = {
        account_name: data.account_name,
        email_address: data.email_address,
        password: data.password,
        website_name: data.website_name,
        website_url: data.website_url
    }
    return test;
}
module.exports = mongoose.model('Account', accountSchema);
