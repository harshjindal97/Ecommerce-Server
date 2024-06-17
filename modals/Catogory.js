const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name:{type:"string",required:true},
    image:{type:"string",required:true},
    color:{type:"string",required:true}
})

exports.Category = mongoose.model('category' , CategorySchema);