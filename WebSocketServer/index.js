const app = require('express')();
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(3000);

const wss = new SocketServer({ server });

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
                    "uri": "ws://9e8465c91517.ngrok.io/ws",
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
    console.log(req.body)
    if (req.status == 'completed') {
        wss.clients.forEach(function each(client) {
            if (client.clientType == 'vonage') {
                client.close()
            }
        })
    }
    res.send('200');
});

wss.on('connection', (ws) => {
    console.log('[server] A client was connected.');

    ws.on('close', () => {
        console.log('[server] Client disconnected');
    });

    ws.on('message', (message) => {
        console.log('[server] Received message');
        try {
            message = JSON.parse(message);
            console.log(message);
        } catch {
            console.log('[server] vonage audio data');
            wss.clients.forEach(function each(client) {
                if (client.clientType == 'ibm' && client.readyState === WebSocket.OPEN) {
                    console.log('sending audio to ibm');
                    client.send(message);
                }
            });
            return;
        }

        if (message.clientType) {
            ws.clientType = message.clientType;
            console.log('setting client user ' + message.clientType);
        } else {
            wss.clients.forEach(function each(client) {
                if (client.clientType == 'user' && client.readyState === WebSocket.OPEN) {
                    console.log('sending smth');
                    client.send(message);
                }
            });
        }
    })
});