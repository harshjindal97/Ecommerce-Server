const { Category } = require('../modals/Catogory.js');
const { Product } = require('../modals/products.js');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET,
})


router.get('/', async (req, res) => {
    const productList = await Product.find().populate('category');
    if (!productList) {
        return res.status(500).json({
            message: 'ProductList not found',
            success: false,
        })
    }
    res.send(productList);
});

router.get('/:id', async (req, res) => {
    const productList = await Product.findById(req.params.id).populate('category');
    if (!productList) {
        return res.status(500).json({
            message: 'ProductList not found',
            success: false,
        })
    }
    res.send(productList);
})


router.post('/create', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).json({
            message: 'Invalid category',
            success: false,
        })
    }

    const pLimit = await import('p-limit').then(module => module.default);

    const limit = pLimit(2);

    // Upload images to Cloudinary
    const imagesToUpload = req.body.image.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });


    const UploadStatus = await Promise.all(imagesToUpload);

    const imgurl = UploadStatus.map((item) => {
        return item.secure_url;
    });
    if (!UploadStatus) {
        return res.status(500).json({
            message: "update status is false",
            success: false
        })
    }

    let product = new Product({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        brand:req.body.brand,
        inStock:req.body.inStock,
        category:req.body.category,
        image:imgurl,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured

    });
    product = await product.save();
    if (!product) {
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.status(200).json(product);
})
router.put('/:id', async (req ,res) =>{
    const pLimit = await import('p-limit').then(module => module.default);

    const limit = pLimit(2);

    // Upload images to Cloudinary
    const imagesToUpload = req.body.image.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });


    const UploadStatus = await Promise.all(imagesToUpload);

    const imgurl = UploadStatus.map((item) => {
        return item.secure_url;
    });
    if (!UploadStatus) {
        return res.status(500).json({
            message: "update status is false",
            success: false
        })
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            brand:req.body.brand,
            inStock:req.body.inStock,
            category:req.body.category,
            image:imgurl,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured
    },
    {new:true}
);
if(!product){
    return res.status(404).json({
        message:"product is not updated",
        success:false
    });
}
res.send(product);
})

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) {
        res.status(400).json({
            message:'product not found'
        })
    }
    res.status(200).json({
        message:'product deleted sucessfully'
    })
})


module.exports = router;