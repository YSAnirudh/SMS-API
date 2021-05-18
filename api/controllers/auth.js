const UserSchema = require('../models/user')
const UserRepo = require('../repository')
const bc = require('bcrypt')
exports.createUser = async function(req, res) {
    try {
        const userId = await UserSchema.find({username : req.body.username});
        if (userId.length != 0) {
            // console.log("User Present")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                error: "User already present."
            })
        }
        myUser = {
            username:req.body.username,
            password:req.body.password
        }
        const user = await UserRepo.addItem(myUser);
        res.json(user);
    } catch (err) {
        // console.log("Unknown Error")
        console.log(err)
        res
        .setHeader('Content-Type', 'application/json')
        .status(400)
        .json({
            type: "Invalid",
            msg: "Used ID problem",
            err: err
        })
    }
}

exports.getUsers = async function(req, res) {
    try {
        users = await UserSchema.find();
        var a = Array();
        for (var i = 0; i < users.length; i++) {
            a.push(users[i].username);
        }
        // console.log("Got Users")
        return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json({
            status : true,
            'users present' : a
        })
    } catch (err) {
        // console.log(err)
        // console.log("Unknown Error")
        res
        .setHeader('Content-Type', 'application/json')
        .status(400)
        .json({
            message: "",
            error: "unknown failure"
        })
    }
}

exports.isAuthorized = async function(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            // console.log("Auth Header not there")
            return res
            .status(401)
            .json({
                message: "",
                error: 'Missing Basic Authorization Header' 
            });
        }

        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        const user = await UserSchema.findOne({username : username})
        if (!user) {
            // console.log("Invalid Creds")
            return res
            .status(401)
            .json({
                message: "Check your username or password",
                error: "Invalid Authentication Credentials"
            });
        }
        if (await bc.compare(password, user.password)) {
            return next();
        } else {
            // console.log("Invalid Creds")
            return res
            .status(401)
            .json({
                message: "Check your username or password",
                error: "Invalid Authentication Credentials"
            });
        }
    } else {
        // console.log("Auth Header not there")
        return res
        .status(500)
        .json({
            message: "",
            error: "Authorization Header not Found"
        });
    }
}

exports.throwError = (req, res) => {
    // console.log("Incorrect HTTP Method")
    return res
    .setHeader('Content-Type', 'application/json')
    .status(405)
    .json({
        "message":"",
        "error":"Not correct HTTP Method"
    });
}

exports.throwErr = (req, res) => {
    // console.log("Incorrect HTTP Method")
    return res
    .setHeader('Content-Type', 'application/json')
    .status(405)
    .json({
        "message":"",
        "error":`Not correct Endpoint. Check Github for Info - https://github.com/YSAnirudh/SMS-API`
    });
}