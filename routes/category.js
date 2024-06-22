const {Category} = require('../modals/Catogory.js');
const express = require('express');
const router = express.Router();
// const pLimit = require('p-limit');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET,
})


router.get('/' , async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList){
        console.log({success:false})
        res.status(500).json({success:false});
    }
    res.send(categoryList);
})

router.get('/:id' , async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(500).json({
            message:'Category doesnot exist'
        })
    }
    return res.status(200).send(category);
})

router.post('/create' , async (req, res) => {
    // const limit = pLimit(2);
    const pLimit = await import('p-limit').then(module => module.default);

    if (!Array.isArray(req.body.image)) {
        return res.status(400).json({
            error: 'Invalid input, req.body.image should be an array of image URLs',
            status: false
        });
    }
    try {
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

        let category = new Category({
            name: req.body.name,
            image: imgurl,
            color: req.body.color
        });

        category = await category.save();

        res.status(201).json(category);

    } catch (err) {
        res.status(500).json({
            error: 'Failed to create category',
            details: err.message,
            success: false
        });
    }
});


module.exports = router;