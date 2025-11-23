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

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    console.log(type)
    if( type === "CommentModerated"){
        console.log("moderated", data)
        const { postId, id, status, content } = data;
        console.log(commentsByPostId)
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment => {
            return comment.id === id 
        })
        comment.status = status

        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdated",
            data: {
                id, 
                status, 
                postId,
                content
            }
        })
    }
    console.log("Event recieved", type)
    res.status(200)
})

app.post("/posts/:id/comments", async (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content, status: "pending"});
    commentsByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, 
            content,
            postId: req.params.id,
            status: "pending"
        }
    })
    res.status(201).send(comments)
});

app.listen(PORT, () => {
    console.log(`Comments Listening on ${PORT}`);
})