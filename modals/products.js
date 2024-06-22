const mongoose = require('mongoose');
const { Category } = require('./Catogory')
const ProductSchema = mongoose.Schema({
    name:{type: 'string', required: true},
    description:{type: 'string', required: true},
    price:{type: 'number', default: 0},  
    brand:{type: 'string', default: ''},
    inStock:{type: 'boolean', required: true},
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    image:{type: ['string'], required: true},
    rating:{type: Number, required: true},
    numReviews:{type: Number, default:0},
    idFeatured:{type: Boolean, default: false},
})
exports.Product = mongoose.model('Product', ProductSchema);