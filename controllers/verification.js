'use strict'

module.exports = (req, res) => {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'my_token_que_verifica_en_facebook');//este es el token que se configura en developers.facebook

    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.status(403).end();
    }
};