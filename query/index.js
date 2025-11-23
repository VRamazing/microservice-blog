const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4002;
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {}



app.get("/posts", (req, res) => {
    res.send(posts);
})


app.post('/events', (req, res) => {
    const {type, data} = req.body

    if( type === "PostCreated"){
      const {id, title} = data
      posts[id] = { id, title, comments: [] }
    }

    if( type === "CommentCreated"){
      const {id, content, postId, status} = data
      const post = posts[postId]
      post.comments.push({id, content, status})
    }
    
    if( type === "CommentUpdated"){
      console.log(data)
      const {id, content, postId, status} = data 
      const post = posts[postId]
      const comment = comment.find(c => c.id === id)
      if(comment){
        comment.content = content
        comment.status = status
      }
      console.log("comment Updated", comment)
      console.log(post)
    }

    console.log("Event recieved", type)
    res.status(200).send({})
})

app.listen(PORT, () => {
    console.log(`Query Listening on ${PORT}`);
})
