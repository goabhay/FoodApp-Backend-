const mongoose = require('mongoose')


const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed more than 20 char'] // this way we write a custom message
    },
    duration:{
        type:Number,
        required:true

    },
    price:{
        type:Number,
        rquired:[true,'price no entered']
    },
    rating:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100,'discount should not exceed price'
        }]
    },
    reviewCnt:{
        type:Number,
        default:0
    }
})


const planModel = mongoose.model('planmodels',planSchema)

module.exports = planModel