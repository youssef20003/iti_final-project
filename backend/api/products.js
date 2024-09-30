const mongoose = require('mongoose');
const Productmodel = require('../models/products');
const cors = require('cors');

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Connect to the database
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    if (req.method === 'GET') {
        try {
            const products = await Productmodel.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Error fetching products", error });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
};
