import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());



//{payloadUrl: 'url', secret: ''}
const github = {
    COMMIT: [],
    PUSH: [],
    MERGE: []
};


app.post('/api/webhooks', (req, res) => {

    const {payloadUrl, secret, eventTypes} = req.body;

    eventTypes.forEach(eventType => {
        github[eventType].push({payloadUrl, secret});
    });

    return res.sendStatus(201);

});


app.post('/api/event-emulate', (req, res) => {

    const {type, data}  = req.body;

    console.log(type, data)

    //Event trigger (Call Webhook)

    setTimeout(async () => {

        //Async function

        const eventLists = github[type];

        for(let i = 0; i < eventLists.length; i++) {

            const {payloadUrl, secret} = eventLists[i];

            console.log("hook data:",payloadUrl, secret);

            try {
                await fetch(payloadUrl, {
                    method: 'POST',
                    headers: {
                        "x-secret": secret,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            } catch (error) {
                console.log(error);
            }

        }

    }, 0)

    return res.sendStatus(200);

});

//Demo endpoint to see db data (github)

app.get('/api/db', (req, res) => {

    res.status(200).json(github);

});

const PORT = process.env.PORT || 5602;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));