'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    address: String,
    qualification: Number,
    phone: Number,
    password: String,
    email: String,
});

module.exports = mongoose.model('hotel', userSchema);