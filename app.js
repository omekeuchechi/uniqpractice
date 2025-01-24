const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const app = express();


const api = process.env.API_URL;
const CONNECTION_STRING = process.env.CONN_STRING;

const userRouter = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRouter = require('./routes/comment');

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

// starting the server
app.listen(3000, () => {
    console.log(api);
    console.log('server is running at port 3000');
})