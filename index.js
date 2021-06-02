const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
var secretKey = 'nGUhUR4C6AvmPZF';
var jsonParser = bodyParser.json();

const users =JSON.parse(fs.readFileSync('./users.json'));
app.get('/app', (req, res) => {
    res.json({
        message: 'Welcome'
    })
});



app.post('/app/login', jsonParser,(req, res) => {
        if (!!req.body) {
        if (!!req.body.userName && !!req.body.password) {
            let authArray = users.userList.filter(item => {
                if (item.userName == req.body.userName && item.password == req.body.password) {
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

                });
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(422);
        }
    }

    else {
        res.sendStatus(422)
    }
});

app.post('/app/requestInfo', checkTokenExist, (req, res) => {
    jwt.verify(req.token, secretKey, (err, data) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            res.json({
                message: "authenticated Successfully"
            })
        }
    });
});


app.listen(5000, () => {
    console.log('Server started in port 5000');
});

function checkTokenExist(req, res, next) {
    const responseToken = req.headers['token'];
    if (!!responseToken) {
        req.token = responseToken;
        next();
    } else {

        res.sendStatus(403);
    }

}