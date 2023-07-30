const express = require('express')
const router = express.Router()
const videos = require('../mockData')
const fs = require('fs')


// get list of videos, to populate the homepage
router.get('/', (req, res) => {
    res.json(videos)
})


// returns metadata for a single video
router.get('/:id/data', (req, res) => {
    const id = parseInt(req.params.id, 10) // parses the string into a integer with a radix of 10
    res.json(videos[id])
})

// used to stream a video of a given id
router.get('/video/:id', (req, res) => {
    const videoPath = `assets/${req.params.id}.mp4`; //we get the id of the video requested using the 'req.params.id'
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size; //reading the file size
    const videoRange = req.headers.range; // range function lets the server know which chunk of the video to send back to the client
    
    
    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10) // implemented back pressure i.e I/O source is paused until the client is ready for more data
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end }); // creates a read stream using the start and end values of the range
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head); // HTTP 206 used to signify that the content being served is partial instead of HTTP 200
        file.pipe(res);


    // deals with browsers that don't send an range in the initial request
    } else {
        const head = {
            'Content-Length': fileSize, // gets the file size
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res); 
    }
});


// captions route
const captionPath = '/home/prntmlhtr/Streamia/backend/'
router.get('/video/:id/caption', (req, res) => res.sendFile(`assets/captions/${req.params.id}.vtt`, { root: captionPath }));
module.exports = router;