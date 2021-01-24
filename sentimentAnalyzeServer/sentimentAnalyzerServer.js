const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
};

const app = new express();

const NLUObject = new getNLUInstance();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const analyzeParams = {
        'text': req.query.url,
        'features': {
            'emotion':{}
        },
    };

    NLUObject.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.emotion.document.emotion);
        })
        .catch(err => {
            return res.send("ERROR " + JSON.parse(err.body).code + ": " + JSON.parse(err.body).error);
        });
});

app.get("/url/sentiment", (req, res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment':{}
        },
    };

    NLUObject.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.sentiment.document.label);
        })
        .catch(err => {
            return res.send("ERROR " + JSON.parse(err.body).code + ": " + JSON.parse(err.body).error);
        });
});

app.get("/text/emotion", (req, res) => {

    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion':{}
        },
    };

    NLUObject.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.emotion.document.emotion);
        })
        .catch(err => {
            return res.send("ERROR " + JSON.parse(err.body).code + ": " + JSON.parse(err.body).error);
        });
});

app.get("/text/sentiment", (req, res) => {

    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment':{}
        },
    };

    NLUObject.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.sentiment.document.label);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("ERROR " + JSON.parse(err.body).code + ": " + JSON.parse(err.body).error);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

