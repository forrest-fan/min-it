const Vonage = require('@vonage/server-sdk');

// Initialize nexmo app
const vonage = new Vonage({
    apiKey: 'c2d841f5',
    apiSecret: 'KHKJckLyaj0F3hTD',
    applicationId: 'f2709944-6cdc-4ff0-9f28-3d0c4b062285',
    privateKey: './private.key'
});

// NCCO = Nexmo Call Control Object
const ncco = [
    {
        "action": "connect",
        "endpoint": [
            {
                "type": "phone",
                "number": "16475580588",
                "dtmfAnswer": 'ppppppppp9740197468#pppppppp#'
            }
        ],
        "machineDetection": "continue"
    },
    {
        "action": "talk",
        "voiceName": "Kendra",
        "text": "This is a call from Vonage. We will be recording this meeting."
    }
];

// Call somebody
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
)