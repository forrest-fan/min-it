const app = require('express')();
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const bodyParser = require('body-parser');
const firebase = require('firebase');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(3000);

const wss = new SocketServer({ server });
const ibm = new WebSocket('wss://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/7f190f1d-cb73-43b6-8e4b-3e3b3b0725ae/v1/recognize?access_token=eyJraWQiOiIyMDIwMTIyMTE4MzQiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLWM3NTY1YTU2LTA4YjktNDdhOC05YjkwLTUyYWMxY2EyZjJiMSIsImlkIjoiaWFtLVNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJyZWFsbWlkIjoiaWFtIiwianRpIjoiOWExMjQ3NzAtNTMxOS00MjI5LWFkZDctNTA4YzM0Y2E4NWMyIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJuYW1lIjoiQXV0by1nZW5lcmF0ZWQgc2VydmljZSBjcmVkZW50aWFscyIsInN1YiI6IlNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsInVuaXF1ZV9pbnN0YW5jZV9jcm5zIjpbImNybjp2MTpibHVlbWl4OnB1YmxpYzpzcGVlY2gtdG8tdGV4dDp1cy1zb3V0aDphLzM4ODliZWQ3YjdkNjQzNGJhNjQ2OGRiMDVhNjI0NTAzOjdmMTkwZjFkLWNiNzMtNDNiNi04ZTRiLTNlM2IzYjA3MjVhZTo6Il0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6IjM4ODliZWQ3YjdkNjQzNGJhNjQ2OGRiMDVhNjI0NTAzIiwiZnJvemVuIjp0cnVlfSwiaWF0IjoxNjEwODM0NzE1LCJleHAiOjE2MTA4MzgzMTUsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.Olzgd4ZsrTNmZQ4AVPlSOwl7TloimQM1iGffeSVPJYEXJp6HwvJGTRm4YIeXm9Sv6LKlYIGKQ1RwMel0gLuCR2vCuzwL9XtTRGHMY_k8wuK8j0sfbP5vNgpQ9SrY_W4SqoDTbPOXsZb0H9Rsu3g73tYuHN_9VAQ3HfwK4MZo2p1cjuSjIUpWBKJbOgDuQ_l-FRXy167RVzDGtk9pL6n1VZLLSHaxxVXFbe0Nr6pam4nqnBokBuT3wD8d46m42Uxx7kP8lXaMI5wzypG7iFxWJdJF_DRYPIq1dgZd6ukmeKSIP0VlhA43vx7EYncncZG64J44gVos4wupnCKGx4tH1w&model=en-US_BroadbandModel');

var firebaseConfig = {
    apiKey: "AIzaSyA6aCc7iz4eMrh5cqsSYUNHZQyAFh9545s",
    authDomain: "min-it-93e2c.firebaseapp.com",
    projectId: "min-it-93e2c",
    storageBucket: "min-it-93e2c.appspot.com",
    messagingSenderId: "284771478650",
    appId: "1:284771478650:web:20a5337292119fc638dfc3",
    measurementId: "G-LHSQE6D9H3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/inbound', (req, res) => {
    res.send(
        [
            {
                "action": "talk",
                "voiceName": "Kendra",
                "text": "This is a call from Vonage. We will be recording this meeting."
            } , {
                "action": "connect",
                "endpoint": [
                  {
                    "type": "websocket",
                    "uri": "ws://736254919d44.ngrok.io/ws",
                    "content-type": "audio/l16;rate=16000",
                    "headers": {
                        "clientType": "vonage"
                    }
                  }
                ]
            }
        ]
    );
});

app.post('/events', (req, res) => {
    console.log(req.body);
    if (req.status == 'completed') {
        ibm.send(JSON.stringify({"action": "stop"}));
        wss.clients.forEach(function each(client) {
            if (client.clientType == 'vonage') {
                client.close();
            }
        });
    }
    res.send('200');
});

ibm.on('open', (event) => {
    console.log('connected to ibm');
    ibm.send(JSON.stringify({'action': 'start', 'content-type': 'audio/l16;rate=16000','max_alternatives':3,'word_confidence':true,'speaker_labels':true}));
});

ibm.on('message', (event) => {
    console.log('message from ibm');
    console.log(event);
});

ibm.on('close', (event) => {
    console.log('connection with ibm clsoed');
});

ibm.on('error', (error) => {
    console.log('error');
});

var notes = {};

wss.on('connection', (ws) => {
    console.log('[server] A client was connected.');

    ws.on('close', () => {
        console.log('[server] Client disconnected');
    });

    ws.on('message', (message) => {
        try {
            message = JSON.parse(message);
        } catch {
            if (ws.clientType == 'vonage') {
                try {
                    ibm.send(message);
                    i++;
                    if (i > 500) {
                        console.log('send stop');
                        ibm.send(JSON.stringify({"action": "stop"}));
                        i = 0;
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('[server] unparsable message');
            }
            return;
        }
        console.log(message);
        if (message.clientType) {
            // Set client type to ws object
            ws.clientType = message.clientType;
            console.log('setting client user ' + message.clientType);
        } else if (message.docKey) {
            // Update user's docKey
            ws.docKey = message.docKey;

            if (ws.clientType == 'meeting-creator') {
                // Create empty item in firebase with doc key if this is new meeting
                console.log('creating record ' + ws.docKey);
                notes[ws.docKey] = '';
            } else if (Object.keys(notes).includes(message.docKey)) {
                // If not meeting creator but doc exists
                console.log('send current notes');
                console.log(ws.docKey);
                console.log(notes);
                ws.send(notes[ws.docKey]);
            } else {
                ws.send(JSON.stringify({'error': 'That link doesn\'t exist!'}));
            }
        } else if (message.newText) {
            if (notes[ws.docKey] !== message.newText) {
                notes[ws.docKey] = message.newText;
                wss.clients.forEach(function each(client) {
                    if (client.readyState === 1 && client.docKey == ws.docKey && client != ws) {
                        console.log(client.docKey);
                        client.send(message.newText);
                    }
                });
            }
        } else {
            console.log(message)
        }
    });

    ws.on('error', (error) => {
        console.log(error);
    })
});