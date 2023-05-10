const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    console.log("api fetched");
    res.setHeader('Content-Type', 'application/json');
    res.json({
        "users": ["userOne", "userTwo", "userThree"]
    })
    console.log("api success");
})