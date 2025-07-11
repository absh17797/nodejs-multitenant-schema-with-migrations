const mongoose = require('mongoose');

const connections = {};

module.exports = async (req, res, next) => {
    const tenant = req.headers['x-tenant-id'];
    if (!tenant) return res.status(400).send('Missing Tenant ID');

    // const dbName = `${process.env.BASE_DB_NAME}/${tenant}`;
    // const mongoURI = process.env.MONGO_URI.replace('<DB_NAME>', dbName);
    
    const dbName = `${process.env.BASE_DB_NAME}_${tenant}`; // → vms_google
    const mongoURI = `mongodb://localhost:27017/${dbName}`;

    console.log("dbName ==>>>>",dbName,process.env.MONGO_URI,process.env.BASE_DB_NAME);
    console.log("dbName ==>>>>",mongoURI);


    if (!connections[tenant]) {
        try {
            const conn =  mongoose.createConnection(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            connections[tenant] = {
                conn,
                Vehicle: conn.model('Vehicle', require('../models/VehicleSchema'))
            };
        } catch (err) {
            console.error('DB Connection Error:', err);
            return res.status(500).send('Could not connect to tenant database');
        }
    }

    req.db = connections[tenant];
    next();
};