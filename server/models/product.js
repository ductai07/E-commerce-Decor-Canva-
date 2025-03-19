const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    brand:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    quantity:{
        type: Number,
        default: 0
    },
    sold:{
        type: Number,
        default: 0
    },
    images:{
        type: Array
    },
    color:{
        type: String,
        enum: ['Black', 'Brown', 'Red', 'White', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']
    },
    rating:[
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String}
        }
    ],
    totalRating:{
        type: Number,
        default: 0
    },
    description: {
        type: String
    }
},{
    timestamps: true 
});

//Export the model
module.exports = mongoose.model('Product', productSchema);