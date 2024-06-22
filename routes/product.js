const {Category} = require('../modals/Catogory.js');
const {Product} = require('../modals/products.js');
const express = require('express');
const router = express.Router();

router.get('/' , async (req, res) => {
    const productList = await Product.find().populate('category');
    if(!productList){
        return res.status(500).json({
            message: 'ProductList not found',
            success: false,
        })
    }
    res.send(productList);
})


router.post('/create' , async (req, res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(404).json({
            message: 'Invalid category',
            success: false,
        })
    }
    let product = await Product(req.body);
    product = await product.save();
    if(!product){
        res.status(500).json({
            error:err,
            success:false
        })
    }
    res.status(200).json(product);
})



module.exports = router;