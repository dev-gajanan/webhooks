const express = require('express');

require('dotenv').config();

const app = express();
app.use(express.json());

const messages = [];

const authMiddleware = (req, res, next) => {
    const headers = req.headers;
    const secretHeader = headers['x-secret'];
    console.log("Headers:",headers);

    if(secretHeader !== process.env.WEBHOOK_SECERT) {
        return res.status(401).json({message: "Invalid secret"});
    }
    next();
}

app.post('/git-info', authMiddleware, (req, res) => {

    const data = req.body;
    console.log("Body", req.body);

    console.log(data);

    messages.push(data);

    res.sendStatus(200);

});

app.get('/', (req, res) => {

    return res.status(200).json(messages);
    
})


const PORT = process.env.PORT || 5601;

app.listen(PORT, () => console.log(`Running on ${PORT}`));