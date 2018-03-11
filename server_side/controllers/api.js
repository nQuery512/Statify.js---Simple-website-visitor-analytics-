// The API controller
// NodeJS only
var mongoose = require('mongoose');
//Send some new_data to db
exports.saveData = function (new_data) {
    //Data saving into MongoDB database
    new_data.save(function (err) {
        if (err) {
            throw err;
        }
        console.log('\nData successfully added.');
        // We need to disconnect now
        mongoose.connection.close();
    });
}

exports.isExisting = function (ModelName, value, callback) {
    ModelName.count(value, function (err, count) {
        if (err)
            throw err;
        if (count == 0)
            callback(false);
        else
            callback(true);
    });
}
