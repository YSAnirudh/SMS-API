const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const User = require('./api/models/user')
require('dotenv').config()
const app = express();
const port = process.env.PORT;

// const client = redis.createClient({
//     host:process.env.REDIS_END,
//     port:process.env.REDIS_PORT,
//     password:process.env.REDIS_PASSWORD
// });
// client.flushdb( function (err, succeeded) {
//     console.log("Flushed Cache: "+succeeded); // will be true if successfull
// });

const MONGO_URI =`mongodb+srv://AniYS:ESAAssn4@sms-api.jjbld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('connected', () => {
  console.log("Mongoose is connected.");
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const routes = require('./api/routes/route');

routes(app);
app.listen(port, () => console.log(`Server Started on Port ${port}...`));
console.log("Please Wait.... Mongoose is Connecting...");