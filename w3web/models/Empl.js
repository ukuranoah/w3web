const mongoose = require('mongoose')

const Schema = mongoose.Schema

const EmplSchema = new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    dropd:{
        type:String,
        required:true
    },
    sdate:{
        type:Date,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    sal:{
        type:Number,
        required:true
    }
})

mongoose.model('empl', EmplSchema)