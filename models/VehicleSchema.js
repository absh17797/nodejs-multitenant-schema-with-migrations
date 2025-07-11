const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number
});

module.exports = VehicleSchema;


