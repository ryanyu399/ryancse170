var mandrill = require("mandrill-api");
var mandrill_client = new mandrill.Mandrill('MANDRILL_TOKEN_HERE');

var logging = require("node-logentries");
var log = logging.logger({
    token:'LOG_ENTERIES_TOKEN_HERE'
});

var async = false;
var ip_pool = "Main Pool";
var send_at = "";  // set in past to just send it away - scheduling possibilities?


function send(req, res) {

    var message = {
        "text": req.body.text,
        "subject": req.body.subject,
        "from_email": "changethis@changethis.com",
        "from_name": "CHANGE THIS",
        "to": [{
            "email": req.body.email,
            "name": req.body.firstName + " " + req.body.lastName
        }],
        "headers": {
            "Reply-To": "changethis@gmail.com"
        }
    };

   mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
     console.dir(result);
     log.info(JSON.stringify(result[0]));
     res.json(true);
    }, function(e) {
        log.info("Email Failure: " + e.name + ' - ' + e.message);
        res.json(false);
       });

}

exports.send = send;
