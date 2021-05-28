mongoose = require('mongoose');
require('dotenv').config({path:'../../'})
const redis = require('redis');
const client = redis.createClient({
    host:process.env.REDIS_END,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
});
// const client = redis.createClient(6379);

exports.inboundSms = async (req, res) => {
    try {
        const from  = req.body.from;
        if (typeof from === "undefined") {
            // console.log("From Missing")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(406)
            .json({
                message : "Inbound is not OK.",
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
                message : "Inbound is not OK.",
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
                message : "Inbound is not OK.",
                error: "text input is missing."
            });
        }

        if (from.length < 6 || from.length > 16) {
            // console.log("From Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Inbound is not OK.",
                error: `from '${from}' is invalid.`
            });
        }

        if (to.length < 6 || to.length > 16) {
            // console.log("To Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Inbound is not OK.",
                error: `to '${to}' is invalid.`
            });
        }

        if (text.length < 1 || text.length > 120) {
            // console.log("Text Length Issue")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Inbound is not OK.",
                error: `text '${text}' is invalid.`
            });
        }

        if (from === to) {
            // console.log("From and To the same")
            return res
            .setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                message : "Inbound is not OK.",
                error: "from and to input should be different"
            });
        }

        // Logic start
        if (text === "STOP" || text === "STOP\n" || text === "STOP\r" || text === "STOP\r\n") {
            const blockFromTo = from + " " + to;
    
            await client.get(blockFromTo, (err, data) => {
                if (err) {
                    throw err;
                }
                if (data !== null) {
                    // console.log("Data was already Cached by STOP.")
                } else {
                    cacheData(req);
                }
            })
        }
        // console.log("Inbound Accepted")
        // Logic Died
        return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json({
            "message":"Inbound sms is ok.",
            "error":""
        });
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

function cacheData(req) {
    try {
        client.setex(req.body.from + " " + req.body.to, 3600 * 4, req.body.to);
        // console.log("Data has been Cached.");
    } catch (err) {
        // console.log("Unknown Error")
        return res
        .setHeader('Content-Type', 'application/json')
        .status(405)
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