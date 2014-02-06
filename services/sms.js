var twilio = require("twilio");
var client = new twilio.RestClient('YOUR TWILIO VALUES', 'YOUR TWILIO VALUES');

var logging = require("node-logentries");
var log = logging.logger({
    token:'LOG_ENTERIES_TOKEN_HERE'
});

function send(req, res) {


  var number = "+1"+req.body.phone,
      textBody = req.body.text;

  client.sms.messages.create({
        to: number,
        from:'YOUR_TWILLIO_NUMBER_HERE',
        body: textBody
     }, function(error, message) {
          if (!error) {
            log.info(message.dateCreated+" : Message sent to " +number+ " SID: " + message.sid);
            res.json(true);
          }
          else {
            log.err("Message to " +number+ " failed");
            res.json(false);
          }
  });

}

exports.send = send;
