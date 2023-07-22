const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');


const app = express();


app.get('/video', (req, res) => {
    res.sendFile('assets/video1.mp4', { root: __dirname });
});


app.use(cors())


app.listen(5000, () => {
    console.log('Listening on port 5000!')
});