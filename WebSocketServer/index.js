const app = require('express')();
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const bodyParser = require('body-parser');
const Vonage = require('@vonage/server-sdk');

// Initialize vonage app
const vonage = new Vonage({
    apiKey: 'c2d841f5',
    apiSecret: 'KHKJckLyaj0F3hTD',
    applicationId: 'f2709944-6cdc-4ff0-9f28-3d0c4b062285',
    privateKey: './private.key'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(3000);

// Set up websocket server
const wss = new SocketServer({ server });

// Vonage NCCO object
var ncco = [
    {
        "action": "connect",
        "endpoint": [
            {
                "type": "phone",
                "number": "16475580588",
                "dtmfAnswer": ''
            }
        ],
        "machineDetection": "continue"
    },
    {
        "action": "talk",
        "voiceName": "Kendra",
        "text": "This is a call from Vonage. We will be recording this meeting."
    }, {
        "action": "connect",
        "endpoint": [
          {
            "type": "websocket",
            "uri": "ws://736254919d44.ngrok.io/ws",
            "content-type": "audio/l16;rate=16000",
            "headers": {
                'clientType': 'vonage'
            }
          }
        ]
    }
];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle vonage inbound calls
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

// Handle vonage events
app.post('/events', (req, res) => {
    console.log(req.body);
    // If call is completed, close connections to IBM and Vonage
    if (req.body.status == 'completed') {
        ibm.send(JSON.stringify({"action": "stop"}));
        ibm.close();
        wss.clients.forEach(function each(client) {
            if (client.clientType == 'vonage') {
                client.close();
            } else if (client.clientType === 'ibm') {
                client.send('done');
            }
        });
    }
    res.send('200');
});


var ibm;

var notes = '';
var i = 0;

// Handle connection to a client
wss.on('connection', (ws) => {
    console.log('[server] A client was connected.');

    ws.on('close', () => {
        console.log('[server] Client disconnected');
    });

    // Handle message from connection
    ws.on('message', (message) => {
        try {
            // Parse to JSON if possible
            message = JSON.parse(message);
        } catch {
            // If not parsable, then it's from vonage or from python connection
            if (ws.clientType == 'vonage') {
                try {
                    // Send audio data to IBM
                    ibm.send(message);
                    i++;
                    if (i > 250) {
                        // Set stoppoint every 5 secs
                        ibm.send(JSON.stringify({"action": "stop"}));
                        i = 0;
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (ws.clientType == 'ibm') {
                // Add message to end of doc
                notes += message;
                wss.clients.forEach(function each(client) {
                    // Send updated message to front end clients
                    if (client.readyState === 1 && (client.clientType == 'front-end' || client.clientType == 'meeting-creator')) {
                        client.send(notes);
                    }
                });
            } else {
                console.log('[server] unparsable message');
            }
            return;
        }

        // Process JSON messages
        if (message.clientType) {
            // Set client type to ws object
            ws.clientType = message.clientType;
            if (message.clientType === 'meeting-creator') {
                // Meeting creator JSON also has meeting ID attribute, set dtmf using meeting id
                ncco[0].endpoint[0].dtmfAnswer = 'ppp' + message.meetingID + '#ppp#';

                // Dial to number and connect to zoom using NCCO
                vonage.calls.create(
                    {
                        to: [{
                            type: 'phone',
                            number: '16476363447'
                        }],
                        from: {
                            type: 'phone',
                            number: '15064429068'
                        },
                        ncco
                    }, (err, result) => {
                        console.log(err || result);
                    }
                );

                // Connect to IBM websocket
                ibm = new WebSocket('wss://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/7f190f1d-cb73-43b6-8e4b-3e3b3b0725ae/v1/recognize?access_token=eyJraWQiOiIyMDIwMTIyMTE4MzQiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLWM3NTY1YTU2LTA4YjktNDdhOC05YjkwLTUyYWMxY2EyZjJiMSIsImlkIjoiaWFtLVNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJyZWFsbWlkIjoiaWFtIiwianRpIjoiMzI1OTU3ZWMtOGY0OC00YTdjLTg3NzYtNmNlYWMwOTRiNTZhIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJuYW1lIjoiQXV0by1nZW5lcmF0ZWQgc2VydmljZSBjcmVkZW50aWFscyIsInN1YiI6IlNlcnZpY2VJZC1jNzU2NWE1Ni0wOGI5LTQ3YTgtOWI5MC01MmFjMWNhMmYyYjEiLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsInVuaXF1ZV9pbnN0YW5jZV9jcm5zIjpbImNybjp2MTpibHVlbWl4OnB1YmxpYzpzcGVlY2gtdG8tdGV4dDp1cy1zb3V0aDphLzM4ODliZWQ3YjdkNjQzNGJhNjQ2OGRiMDVhNjI0NTAzOjdmMTkwZjFkLWNiNzMtNDNiNi04ZTRiLTNlM2IzYjA3MjVhZTo6Il0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6IjM4ODliZWQ3YjdkNjQzNGJhNjQ2OGRiMDVhNjI0NTAzIiwiZnJvemVuIjp0cnVlfSwiaWF0IjoxNjEwODc3OTI1LCJleHAiOjE2MTA4ODE1MjUsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.WyDOf068H4Jg9WiBbmxHKxH6Dh_5oeMhpEJuCeDOG6YF9vJspkyo38o-2uepu_EhBCLdXpSqI_7GT3P3WqkAF70sn1X2WV3KGOwhDteEFq8xsOhc7bWe-RB3tK1toHJe8gbC9pcm5YtQzhBu9LKEJQ2eWGRiosIbhLmDwvasGZrOQNlhcSg1xTig7Kncdp-MpPGchGGdcQrB8hU2y7P8HStbvQlbjIsPc8hpdIjlsrrbRYORutFSSR_wRJZ3CzyyZQKOVAvA3vQCM0SB4t7R07BizqyPrG1l-r5gD5rhf03FUc8Zvx1lun-qUf66cwRGkDJdNcrZkOBuJ30z4WTJdQ&model=en-US_BroadbandModel');
                
                // Handle IBM events
                ibm.on('open', (event) => {
                    console.log('connected to ibm');
                    ibm.send(JSON.stringify({'action': 'start', 'content-type': 'audio/l16;rate=16000'}));
                });
                
                ibm.on('message', (event) => {
                    console.log('message from ibm');
                    ibmResponse = JSON.parse(event);
                    if (ibmResponse.results) {
                        wss.clients.forEach(function each(client) {
                            if (client.readyState === 1 && client.clientType === 'ibm') {
                                // Forward IBM data to Will's python code
                                console.log('send to will');
                                client.send(JSON.stringify(ibmResponse));
                            }
                        });
                    }
                });
                
                ibm.on('close', (event) => {
                    console.log('connection with ibm clsoed');
                });
                
                ibm.on('error', (error) => {
                    console.log(error);
                });
            }
        } else if (message.docKey) {
            // Update user's docKey
            ws.docKey = message.docKey;

            if (ws.clientType == 'meeting-creator') {
                notes = '';
            } else {
                // Send updated notes to people on same URL
                ws.send(notes);
            }
        } else if (message.newText) {
            // Handle new text from front end, if user edits doc
            if (notes !== message.newText) {
                notes = message.newText;
                // Forwrard new text to all clients except current one
                wss.clients.forEach(function each(client) {
                    if (client.readyState === 1 && client != ws && (client.clientType == 'front-end' || client.clientType == 'meeting-creator')) {
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