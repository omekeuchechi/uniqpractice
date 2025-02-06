const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const multer  = require('multer')
const path = require('path');
const authJs = require('./middlewares/auth');
const fs = require('fs');

const app = express();


const api = process.env.API_URL;
const CONNECTION_STRING = process.env.CONN_STRING;

// Import the storage object from multerStorage.js
const { storage, fileFilter } = require('./middlewares/multerStorage');

const upload = multer({ storage });
const userRouter = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRouter = require('./routes/comment');
// const { Storage } = require('Storage');

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(`${api}/user`, userRouter);
app.use(`${api}/post`, postRoutes);
app.use(`${api}/comment`, commentRouter);


// get / post /
// setting the Route and also listeing for http requests of get
// app.get(`${api}/posts`, (req, res) => {
//     // res.send('Myteacher');
//     const response = {
//         "post": [
//             {
//                 "id": 1,
//                 "content": "good"
//             },
//             {
//                 "id": 2,
//                 "content": "bad"
//             }
//         ]
//     }
//     res.send(response);
// })

mongoose.connect(CONNECTION_STRING).then(() => {
    console.log('DATABASE STARTED');
}).catch((err) => {
    console.log(err);
})

app.get(`${api}/user`, (req, res) => {
    const user = req.body;
    console.log(user);

    res.send(user);
})

app.post(`${api}/upload`, authJs, upload.single('avater'), (req, res) => {
    // Handle the uploaded file
    // req.file contains information about the uploaded file
    // req.body contains the other form fields
  
    // Example: Save the uploaded file to a database or perform any other operations
    // ...
  });


// starting the server
app.listen(3000, () => {
    console.log(api);
    console.log('server is running at port 3000');
})