// The main application script, ties everything together.

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
var port = 3000;
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        message: 'it works'
    });
});

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/mydb');

// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');
app.post('/', api.postUser);

app.listen(3000);
console.log("Express server listening on port 3000");
