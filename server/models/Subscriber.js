const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const subscriberSchema = mongoose.Schema({
    userTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
}, {timestamps: true})

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }