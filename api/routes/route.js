'use strict';

module.exports = function(app) {
    const inbound = require('../controllers/inbound');
    const outbound = require('../controllers/outbound');
    const auth = require('../controllers/auth');
    app.route('/inbound/sms')
        .get(inbound.throwError)
        .delete(inbound.throwError)
        .put(inbound.throwError)
        .post(auth.isAuthorized, inbound.inboundSms);
    app.route('/outbound/sms')
        .get(outbound.throwError)
        .delete(outbound.throwError)
        .put(outbound.throwError)
        .post(auth.isAuthorized, outbound.outboundSms);
    app.route('/users/auth/create')
        .get(auth.throwError)
        .delete(auth.throwError)
        .put(auth.throwError)
        .post(auth.createUser)
    app.route('/users/auth/get')
        .get(auth.getUsers)
        .delete(auth.throwError)
        .put(auth.throwError)
        .post(auth.throwError)
    
}

