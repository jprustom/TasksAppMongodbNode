import mongoose = require("mongoose");

const databaseName:string='task-manager-api'
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})

//Head Over To https://mongoosejs.com/docs/schematypes.html
const taskSchema=new mongoose.Schema({
    description:{
        type:String
    },
    completed:{
        type:Boolean
    }
})
const Task=mongoose.model('Task',taskSchema)

const task=new Task({
    description:"Learn a lot of new skills !",
    completed:false
})

task.save().then(()=>{
    console.log(task)
}).catch(err=>{console.log(err)})