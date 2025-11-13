const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios")

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}

const PORT = 4000;

app.get("/posts", (req, res) => {
    res.send(posts);
})

app.post("/posts", (req, res) => {
    const id = randomBytes(4).toString("hex")
    const {title} = req.body
    posts[id] = {id, title};

    axios.post("http://localhost:4005/events", {
        type: "PostCreated",
        data: {
            id, 
            title
        }
    })

    res.status(201).send(posts[id]);

})

app.post('/events', (req, res) => {
    const body = req.body
    console.log("Event recieved", body.type)
    res.status(200)
})

app.listen(PORT, () => {
    console.log(`Posts Listening on ${PORT}`);
})