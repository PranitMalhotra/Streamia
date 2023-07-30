// packages required for our project
const express = require('express');

//fs is used to read and writes from files
const fs = require('fs');
const cors = require('cors');

//path finds a way to work with paths in files and directories
const path = require('path');
const app = express();


app.use(cors())


//videos route
const Videos = require('./routes/videos')
app.use('/videos', Videos)


// we listen to our service at port 5000
app.listen(5000, () => {
    console.log('Listening on port 5000!')
});