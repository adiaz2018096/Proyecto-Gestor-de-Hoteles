'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyUser = 'clave_super_secreta_12345';
var keyHotel = 'clave_super_secreta_54321';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        iat:  moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, keyUser);
}

exports.createTokenHotel = (hotel)=>{
    var payload = {
        sub: hotel._id,
        name: hotel.name,
        address: hotel.address,
        phone: hotel.phone,
        email: hotel.email,
        iat: moment().unix(),
        expt: moment().add(30, "minutes").unix()
    }
    return jwt.encode(payload, keyHotel);
}