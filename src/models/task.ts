import mongoose = require("mongoose");

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default: false
    }
})
export const taskModel=mongoose.model('Task',taskSchema)