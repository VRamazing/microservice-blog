const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios")

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 4001;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/events', (req, res) => {
    const body = req.body
    console.log("Event recieved", body.type)
    res.status(200)
})

app.post("/posts/:id/comments", (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content});
    commentsByPostId[req.params.id] = comments;

    axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, 
            content,
            postId: req.params.id
        }
    })
    res.status(201).send(comments)
});

app.listen(PORT, () => {
    console.log(`Comments Listening on ${PORT}`);
})