const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/connectDB');
const router = require('./routes/index');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 8080; // default port to listen  

app.get('/', (request, response) => {
    response.json({
        message: 'server is up and running '+PORT
    })
});

//Api end point
app.use('/api', router);

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log('error', error);
});