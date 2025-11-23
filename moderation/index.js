const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const PORT = 4003
const app = express()

app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const { type, data } = req.body
    let {id, content, status, postId} = data

    if(type === "CommentCreated"){
        status = status.includes('orange') ? 'rejected' : 'approved'
    }

    await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
            id,
            postId,
            content,
            status
        }
    }) 

    res.send({})
})

app.listen(PORT, () => {
    console.log(`Moderation Listening on port: ${PORT}`)
})