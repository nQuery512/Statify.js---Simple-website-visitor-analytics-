const http = require('http');
var mongoose = require('mongoose');
var Visitor = require('./models/visitor.js');
var Account = require('./models/account.js');
var api = require('./controllers/api.js');
var isExisting = api.isExisting;
var saveData = api.saveData;
const port = 3000;

const server = http.createServer();
console.log('server is listening on ' + port);
server.listen(port);
server.on('request', function (request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    console.log(request.method);

    var body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {

        //In case there's content in the POST request
        if (body) {
            console.log('\nRequest content:' + body + '\n');
            body = JSON.parse(body);
            mongoose.Promise = global.Promise;
            mongoose.connect('mongodb://localhost/statify', {
                useMongoClient: true
            });

            //Pattern detection
            //Pattern = VISITOR_INFO
            if (body.pattern == 'visitor_info') {
                var value = {
                    query: body.query
                }
                var new_data = new Visitor(Visitor.store(body));

                //Check if visitor already exist
                isExisting(Visitor, value, function (exist) {
                    if (!exist)
                        saveData(new_data);
                    else
                        console.log('\nVisitor already exist.');
                });
            }

            //Pattern = ACCOUNT_REGISTRATION
            else if (body.pattern == 'account_registration') {
                var value = {
                    email: body.email
                }
                var new_data = new Account(Account.store(body));
                //Check if account_name or website URL already in db
                isExisting(Account, value, function (exist) {
                    if (!exist)
                        saveData(new_data);
                    else
                        console.log('\nAccount already exist.');
                });
            }
        }
        response.end('Hello Node.js Server');
    });
});
