const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/records', (req, res) => {

    const filePath = path.join(__dirname, '../data/data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            console.error("error reading json file:", err);
            return res.status(500).json({message: 'Error reading data'});
        }
        res.json(JSON.parse(data));
    })


})

module.exports = router;