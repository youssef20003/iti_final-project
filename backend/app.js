const express = require('express')
const cors = require('cors');
const server = express()
const mongoose = require('mongoose')
const Productmodel= require('./models/products')
const Cart = require('./models/cart');

server.use(express.json());
server.use(cors());
mongoose.connect('mongodb+srv://youssefm:f7xCCdVxXUZ2Euu1@cluster0.jdvmm.mongodb.net/iti?retryWrites=true&w=majority&appName=Cluster0').then(function () {
    console.log('database connected')
}).catch(function (error) {
    console.log('database disconnected')
})
server.listen(3002,()=>{
    console.log('Server is running on http://localhost:3002')});
server.get("/products", function(req , res){
    Productmodel.find().then((data) =>{
    res.send(data)
}).catch(()=>{
    res.send("error")
})
})


//-----------cart--------------------------------
// Add to Cart
server.post('/add-to-cart', (req, res) => {
    const { cartId, productId, quantity } = req.body;

    Productmodel.findOne({ id: productId })
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return Cart.findOne({ _id: cartId });
        })
        .then(cart => {
            if (!cart) {
                // If there is no cart, create one
                const newCart = new Cart({ _id: cartId, products: [{ productId, quantity }] });
                return newCart.save();
            } else {
                const productIndex = cart.products.findIndex(p => p.productId === productId);

                if (productIndex > -1) {
                    // Update quantity if product exists
                    cart.products[productIndex].quantity += quantity;
                } else {
                    // Add new product if not in cart
                    cart.products.push({ productId, quantity });
                }
                return cart.save();
            }
        })
        .then(cart => res.status(200).json(cart))
        .catch(error => res.status(500).json({ message: 'Error adding to cart', error }));
});

//show cart
server.get('/cart/:cartId', (req, res) => {
    Cart.findOne({ _id: req.params.cartId })
        .then(cart => {
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            res.status(200).json(cart);
        })
        .catch(error => res.status(500).json({ message: 'Error fetching cart', error }));
});

// Update Cart

server.put('/update-cart', (req, res) => {
    const { cartId, productId, quantity } = req.body;

    Cart.findOne({ _id: cartId })
        .then(cart => {
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            const productIndex = cart.products.findIndex(p => p.productId === productId);

            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            cart.products[productIndex].quantity = quantity;
            return cart.save();
        })
        .then(cart => res.status(200).json(cart))
        .catch(error => res.status(500).json({ message: 'Error updating cart', error }));
});

// Delete from Cart

server.delete('/delete-from-cart', (req, res) => {
    const { cartId, productId } = req.body;

    Cart.findOne({ _id: cartId })
        .then(cart => {
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            cart.products = cart.products.filter(p => p.productId != productId);
            return cart.save();
        })
        .then(cart => res.status(200).json(cart))
        .catch(error => res.status(500).json({ message: 'Error removing from cart', error }));
});

//----------------------------------------------------------------------