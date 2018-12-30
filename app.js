require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Routers
const userRouter = require('./src/routes/user');
const postRouter = require('./src/routes/posts');

// mongodb config
require('./config/db');

// Initializing express app
const app = express();

// Body Parser Configuration
app.use(bodyParser.json({ // to support JSON-encoded bodies
  limit: '1mb'
}));

app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  limit: '1mb',
  extended: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

// Router Initialization
app.get('/api/', (req, res) => {
  res.status(200).json({
    msg: 'Register to Blogs-ACL API'
  });
});

// API Endpoints
app.use('/api/user/', userRouter);
app.use('/api/post/', postRouter);

module.exports = app;
