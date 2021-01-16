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
                    "uri": "ws://7f1c7b3c0b01.ngrok.io/ws",
                    "content-type": "audio/l16;rate=16000",
                    "headers": {
                        "name": "J Doe",
                        "age": 40,
                        "address": {
                            "line_1": "Apartment 14",
                            "line_2": "123 Example Street",
                            "city": "New York City"
                        }
                    }
                  }
                ]
            }
        ]
    );
});

app.post('/events', (req, res) => {
    console.log(req.body)
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
            console.log('[server] message is not parsable');
            wss.clients.forEach(function each(client) {
                if (client.clientType == 'user' && client.readyState === WebSocket.OPEN) {
                    console.log('sending smth');
                    client.send(message);
                }
            });
            return;
        }

        if (message.clientType) {
            ws.clientType = message.clientType;
            console.log('setting client user');
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