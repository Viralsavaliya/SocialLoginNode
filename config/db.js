const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Conntected Succesfully')
})
    .catch((err) => {
        console.log(err)
    })


    // dDJwi9rtX4EDVD58vUOqSreTV
    // qPGg6u1bQYBfcLMJj09txZAegdbLM696toZrWtZ93Cw4CdH5CV