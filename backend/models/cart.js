const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    _id: Number, // Cart ID
    products: [
        {
            productId: { 
                type: Number, 
                ref: 'Product', // Reference to Product model
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true,
                min: 1 // Ensure quantity is at least 1
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
