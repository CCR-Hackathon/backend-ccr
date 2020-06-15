const AssistantV1 = require('watson-developer-cloud/assistant/v1');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var connFactory = require("./connection/connFactory.js");

var cors = require('cors');
app.use(cors())

let Promise = require('bluebird');

let geoLocations = [];
let message = [];

var port = process.env.PORT || 3001
app.listen(port, function () {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

var fs = require('fs');
var https = require('https');

var options = {
    key: fs.readFileSync('./certs/server-key.pem'),
    cert: fs.readFileSync('./certs/server-crt.pem'),
    ca: fs.readFileSync('./certs/ca-crt.pem'),
};

https.createServer(options, app, function (req, res) {
}).listen(3000);


const assistant = new AssistantV1({
    username: '',
    password: '',
    url: 'https://gateway.watsonplatform.net/assistant/api/',
    version: '2018-02-16',
});

app.post('/conversation/', (req, res) => {
    const { text, context = {} } = req.body;

    const params = {
        input: { text },
        workspace_id: '9b880410-ef5d-4c22-a686-8a819cda924c',
        context,
    };

    assistant.message(params, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {

            let resp = {
                text: response.output.text[0],
                context: response.context,
                output: response.output.text[0]
            }

            res.json(resp);

        }
    });
});

app.post('/setCoord', (req, res) => {
    let {
        latitude,
        longitude
    } = req.body

    try {
        if (latitude == undefined || longitude == undefined) {
            return res.status(400).send({
                Message: 'Formato errado'
            })
        }
        console.log(latitude, longitude)
        geoLocations.push({
            latitude,
            longitude
        })
        res.status(200).send({
            Message: 'Geolocation enviado'
        })
    } catch (error) {
        res.status(500).send(erro)
    }
})

app.post('/sendMessage', (req, res) => {
    let {mensagem} = req.body

    try {
        if (mensagem == undefined) {
            return res.status(400).send({
                Message: 'Formato errado'
            })
        }
        console.log(mensagem)
        message.push(mensagem)

        res.status(200).send({
            Message: 'Mensagem enviada'
        })
    } catch (error) {
        res.status(500).send(erro)
    }
})

app.get('/getCoord', (req, res) => {
    res.status(200).send(geoLocations)

})

app.get('/getMessages', (req, res) => {
    res.status(200).send(message)

})


