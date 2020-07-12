'use Strict'

var express = require('express');
var UserController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');


api.post('/saveUser', UserController.saveUser);
api.get('/listUser', mdAuth.ensureAuthAdmin, UserController.listUsers);
api.post('/login', UserController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, UserController.updateUser);
api.delete('/deleteUser/:id', mdAuth.ensureAuthAdmin, UserController.deleteUser);


api.post('/ordenaz', UserController.ordenaz);
api.post('/ordenza', UserController.ordenza);
api.post('/findForMoney', UserController.findForMoney);
api.post('/findForMoney2', UserController.findForMoney2);
api.post('/calification', UserController.calification);
api.get('/createPdf/:id', UserController.createPdf);
api.post('/fech', UserController.fech);
module.exports = api;