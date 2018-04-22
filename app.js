var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

require('dotenv').load();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.post('/lang-translator', (req, res) => {
  const authentication_key = new Buffer(`${ "707f9005-e9b0-465e-96a8-ff3054b0eefc" }:${ "lSuqnDb1kPrT" }`).toString('base64');
  const options= {
    url: "https://gateway.watsonplatform.net/language-translator/api/v2/translate",
    method: "POST",
    headers: {
      'Authorization': `Basic ${ authentication_key }`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(req.body)
  }
  request(options, (err, result) => {
    if (!err) {
      console.log(result.body);
      toneAnalyzer({ text: result.body }, (err, result) => {
        if (!err)
          res.status(200).json(result);
        else
          res.status(500).json(err);
      })
    } else {
      console.log(err);
      res.status(500).json(err);
    }
  });
});

const toneAnalyzer = (data, callback) => {
  const authentication_key = new Buffer(`${ "4eaf5e25-878b-4a56-9acc-f6a55f0e212d" }:${ "rN4nXxDzaH0V" }`).toString('base64');
  const options = {
    url: "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21",
    method: "POST",
    headers: {
      'Authorization': `Basic ${ authentication_key }`,
      'Content-type': 'application/json',
      'Accept-Language': 'pt-br'
    },
    body: JSON.stringify(data)
  }
  request(options, (err, result) => {
    if(!err) {
      console.log(result.body);
      var body = JSON.parse(result.body);
      callback(null,{ tones: body.document_tone.tones });
    } else {
      console.log(err);
      callback(err,null);
    }
  });
}

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`App is listening on ${app.get('port')}`);
})

module.exports = app;
