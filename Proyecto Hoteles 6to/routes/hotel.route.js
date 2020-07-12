'use Strict'

var express = require('express');
var HotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveHotel', mdAuth.ensureAuthAdmin, HotelController.saveHotel);
api.get('/listHotel', HotelController.listHotel);
api.put('/editHotel/:id', mdAuth.ensureAuth, HotelController.updateHotel);
api.delete('/deleteHotel/:id', mdAuth.ensureAuth, HotelController.deleteHotel);
api.post('/login', HotelController.login);
module.exports = api;
