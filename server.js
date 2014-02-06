var express = require("express"),
    api     = require("./services/users"),
    email   = require("./services/email"),
    sms     = require("./services/sms"),
    logging = require("node-logentries");

var log = logging.logger({
    token:'YOUR_LOGENTERIES_TOKEN'
});

var app = module.exports = express();
app.configure(function(){
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

/* REST routes for User CRUD Service */
app.get("/api/users", api.users);
app.get("/api/users/:id", api.user);
app.post("/api/users", api.createUser);
app.put("/api/users/:id", api.updateUser);
app.delete("/api/users/:id", api.destroyUser);

/* Email Service */
app.post("/api/email", email.send);

/* Text Service */
app.post("/api/sms", sms.send);


/* Start the server */
app.listen(3000, function(){
    console.log("App started listening on port %d in %s mode", this.address().port, app.settings.env);
    log.info("Server restarted: "+new Date());
});