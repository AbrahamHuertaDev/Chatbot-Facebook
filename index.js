'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/webhook', verificationController);
app.post('/webhook', messageWebhookController);

const server = app.listen(PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});