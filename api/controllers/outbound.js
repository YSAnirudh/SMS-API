mongoose = require('mongoose');
require('dotenv').config({path:'../../'})
const redis = require('redis');
const client = redis.createClient({
    host:process.env.REDIS_END,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
});
// const client = redis.createClient(6379);

exports.outboundSms = async function (req, res) {
    try {
        const from  = req.body.from;
        if (typeof from === "undefined") {
            // console.log("From Missing")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(406)
            .json({
                message : "Outbound is not OK.",
                error: "from input is missing."
            });
        }
        const to = req.body.to;
        if (typeof to === "undefined") {
            // console.log("To Missing")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(406)
            .json({
                message : "Outbound is not OK.",
                error: "to input is missing."
            });
        }
        const text = req.body.text;
        if (typeof text === "undefined") {
            // console.log("Text Missing")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(406)
            .json({
                message : "Outbound is not OK.",
                error: "text input is missing."
            });
        }

        if (from.length < 6 || from.length > 16) {
            // console.log("From Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Outbound is not OK.",
                error: `from '${from}' is invalid.`
            });
        }

        if (to.length < 6 || to.length > 16) {
            // console.log("To Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Outbound is not OK.",
                error: `to '${to}' is invalid.`
            });
        }

        if (text.length < 1 || text.length > 120) {
            // console.log("Text Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Outbound is not OK.",
                error: `text '${text}' is invalid.`
            });
        }

        if (from === to) {
            // console.log("From and To the same")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Outbound is not OK.",
                error: "from and to input should be different"
            });
        }

        // Logic start
        const currentFromTo = from + " " + to;
        
        hello = await client.get(currentFromTo, (err, blockedFromTo) => {
            if (err) {
                throw err;
            }
            if (blockedFromTo !== null) {
                // console.log("Blocked by STOP")
                return res
                .setHeader('Content-Type', 'application/json')
                .status(403)
                .json({
                    "message":"Outbound is not OK.",
                    "error":`sms from ${from} to ${to} blocked by STOP request`
                });
            } else {
                client.get(from, (err, FROM) => {
                    if (err) {
                        throw err
                    }
                    if (FROM != null) {
                        client.incr(from)
                        if (FROM >= process.env.MAX_REQUESTS) {
                            // console.log("API Limit Reached")
                            return res
                            .setHeader('Content-Type', 'application/json')
                            .status(403)
                            .json({
                                "message":"Outbound is not OK.",
                                "error":`limit reached from ${from}`
                            });
                        } else {
                            // console.log("Outbound Accept")
                            return res
                            .setHeader('Content-Type', 'application/json')
                            .status(200)
                            .json({
                                "message":"Outbound sms is ok.",
                                "error":""
                            });
                        }
                    } else {
                        cacheFreq(req)
                        // console.log("Outbound Accept")
                        return res
                        .setHeader('Content-Type', 'application/json')
                        .status(200)
                        .json({
                            "message":"Outbound sms is ok.",
                            "error":""
                        });
                    }
                })
            }
        })
        // Logic Died
        
    } catch (err) {
        // console.log("Unknown Error")
        return res
        .setHeader('Content-Type', 'application/json')
        .status(400)
        .json({
            "message":"",
            "error":"unknown failure",
            err :err
        });
    }
}

async function cacheFreq(req) {
    try {
        client.setex(req.body.from, 3600, 1);
    } catch (err) {
        // console.log("Unknown Error")
        return res
        .setHeader('Content-Type', 'application/json')
        .status(400)
        .json({
            "message":"",
            "error":"unknown failure"
        });
    }
}

exports.throwError = (req, res) => {
    // console.log("Incorrect HTTP Method")
    return res
    .setHeader('Content-Type', 'application/json')
    .status(405)
    .json({
        "message":"Check the HTTP Method",
        "error":"Incorrect HTTP Method"
    });
}