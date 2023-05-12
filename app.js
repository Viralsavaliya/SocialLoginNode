require('dotenv').config();
require('./config/db')

const express = require('express');
const app = express();
const  port = 3000;
const user = require('./routers/user')
app.use(express.json({ limit: "50mb" }))
const cors = require('cors');



app.use('/api',cors(),user)




app.listen(port , () => { 
    console.log(`server started successfully ${port}`);
})
