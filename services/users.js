var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user_database');

var logging = require("node-logentries");
var log = logging.logger({
    token:'07e7bf47-9452-4fb3-9b18-42a40431ad69'
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', function callback () {
    console.log("connected to Mongodb");
    log.info("Mongodb started " + new Date());
});

var masterUserSchema = { firstName: 'string',
                         lastName: 'string',
                         email : 'string',
                         phone: 'string' };

var User = mongoose.model('User', mongoose.Schema(masterUserSchema));

exports.users = function(req, res) {
    User.find({}, function(err, obj) {
        res.json(obj)
    });
};

exports.user = function(req, res) {

    User.findOne({ _id: req.params.id }, function(err, obj) {
        res.json(obj);
    });
};

exports.createUser = function(req, res) {
    var user = new User(req.body);
    user.save();
    res.json(req.body);
};

exports.updateUser = function(req, res) {
    User.findByIdAndUpdate(req.params.id, {
            $set: { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, phone: req.body.phone }
        }, { upsert: true },
        function(err, obj) {
            return res.json(true);
        });
};

exports.destroyUser = function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        res.json(true);
    });
};