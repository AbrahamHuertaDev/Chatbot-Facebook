'use strict'

const request = require('request')

const FACEBOOK_ACCESS_TOKEN = 'EAAVEBgsxOTgBABixYN6dBAKy58pZARuDkQQcWcITATqoCOzZArokPN5w7qHK6FyZAQpuZB8n31GwZAcSr8Fqjsjio7qo5SNZBNBrgZCTUEKlO5v2OgZAiZB3uMbynxOxlx9K6NoMqxEzPpKHmYXiY8CAw8yKCyLhd4cu6kfgmq7OtBdmHPLnVXGX5';

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;
  
    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    var payload = event.postback.payload;
  
    console.log("Received postback for user %d and page %d with payload '%s' " + 
      "at %d", senderID, recipientID, payload, timeOfPostback);
  
    // When a postback is called, we'll send a message back to the sender to 
    // let them know it was successful
    sendTextMessage(senderID, "Postback called");
  }

//This is magic, this can send a message to Facebook
function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.10/me/messages',
      qs: { access_token: FACEBOOK_ACCESS_TOKEN },
      method: 'POST',
      json: messageData
  
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
  
        console.log("Successfully sent generic message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
        console.error("Unable to send message.");
        console.error(response);
        console.error(error);
      }
    });  
  }

//Send to Facebook a text message
function sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };
  
    callSendAPI(messageData);
  }

//??
function sendGenericMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: "rift",
                subtitle: "Next-generation virtual reality",
                item_url: "https://www.oculus.com/en-us/rift/",               
                image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                buttons: [{
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/rift/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for first bubble",
                }],
              }, {
                title: "touch",
                subtitle: "Your Hands, Now in VR",
                item_url: "https://www.oculus.com/en-us/touch/",               
                image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                buttons: [{
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/touch/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for second bubble",
                }]
              }]
            }
          }
        }
      };  
      callSendAPI(messageData);
  }

//Get message when we type in facebok
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
  
    console.log("Received message for user %d and page %d at %d with message:", 
      senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
  
    var messageId = message.mid;
  
    var messageText = message.text;
    var messageAttachments = message.attachments;
  
    if (messageText) {
  
      // If we receive a text message, check to see if it matches a keyword
      // and send back the example. Otherwise, just echo the text we received.
      switch (messageText) {
        case 'generic':
          sendGenericMessage(senderID);
          break;
  
        default:
          sendTextMessage(senderID, messageText);
      }
    } else if (messageAttachments) {
      sendTextMessage(senderID, "Message with attachment received");
    } else if (event.postback) {
        receivedPostback(event);  
    }
  }

module.exports = {
    receivedMessage
};


