const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Conntected Succesfully')
})





    .catch((err) => {
        console.log(err)
    })