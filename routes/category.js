const {Category} = require('../modals/Catogory.js');
const express = require('express');
const router = express.Router();
const plimit = require('p-limit');
const cloudinary = require('cloudinary');

router.get('/' , async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList){
        console.log({success:false})
        res.status(500).json({success:false});
    }
    res.send(categoryList);
})

router.post('/create' , async (req, res) => {
    const limit = plimit(2);

    const imagesToUpload = req.body.image.map((image)=>{
        return limit(async ()=>{
            const result = await cloudinary.uploader.upload(image);
            return result;
        })
    })
    const UploadStatus = await Promise.all(imagesToUpload);
})

module.exports = router;