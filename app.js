require('dotenv').config();
require('./config/db')

const express = require('express');
const app = express();
const port = 3000;
const user = require('./routers/user')
app.use(express.json({ limit: "50mb" }))
const cors = require('cors');
const path = require('path');
const multer = require('multer');
var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use('/', express.static(path.join(__dirname, '/uploads')));

app.use('/api', cors(), user)



app.listen(port, () => {
    console.log(`server started successfully ${port}`);
})


