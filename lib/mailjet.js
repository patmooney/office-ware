
// https://github.com/mailjet/mailjet-apiv3-nodejs
var api_key = process.env.MAILJET_API_KEY || '';
var api_secret = process.env.MAILJET_API_SECRET || '';
var MailJet = require('node-mailjet').connect( api_key, api_secret );
