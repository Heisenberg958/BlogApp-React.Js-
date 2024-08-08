// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let blogPosts = [];
let id = 1;

app.get('/blogposts', (req, res) => {
    res.json(blogPosts);
});

app.post('/blogposts', (req, res) => {
    const newPost = { id: id++, ...req.body };
    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

app.put('/blogposts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        blogPosts[postIndex] = { id: postId, ...req.body };
        res.json(blogPosts[postIndex]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.delete('/blogposts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    blogPosts = blogPosts.filter(post => post.id !== postId);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
