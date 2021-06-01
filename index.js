const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var fs = require('fs');
var secretKey = 'nGUhUR4C6AvmPZF';
// const users =JSON.parse(fs.readFileSync('./users.json'));
const users = {
    "userList": [
        {
            "userName": "AchuThilak",
            "password": "Test@2021"
        },
        {
            "userName": "TestUser",
            "password": "Test@2021"
        }
    ]
};
app.get('/app', (req, res) => {
    res.json({
        message: 'Welcome'
    })
});

app.post('/app/login', (req, res) => {
    if (!!req.body.userName && !!req.body.password) {
        let authArray = users.userList.filter(item => {
            if (item.userName == trim(req.body.userName) && item.password == trim(req.body.password)) {
                return (true);
            }
            else {
                return (false);
            }
        })
        if (authArray.length > 0) {
            jwt.sign(authArray[0], secretKey, (err, token) => {
                res.json({
                    "token": token
                })

            })
        }
        else {
            res.status(403);
        }
    }

    else {
        res.status(422)
    }
})


app.listen(5000, () => {
    console.log('Server started in port 5000');
});

function verifyToken(req, res, next) {
    const responseToken = req.headers['token'];
    if (!!token) {
        req.token = token;
        next();
    } else {

        res.sendStatus(403);
    }

}