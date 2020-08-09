const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./taskModel')  
const sharp = require('sharp')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value: string) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value: Number) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
            }
    ],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
}) 

//https://mongoosejs.com/docs/tutorials/virtuals.html#populate
userSchema.virtual('tasks',{
    ref:'Task', //ref: which model to populate documents from
    //Documents will be populated from the model in ref whose foreignField matches this document's localfield
    localField:'_id',
    foreignField:'owner'
})

//Hide some properties when returning the user in a JSON format
userSchema.methods.toJSON=function(){
    const user=this
    const userAsJSON=user.toObject()
    delete userAsJSON.avatar
    delete userAsJSON.password
    delete userAsJSON.tokens
    delete userAsJSON._id
    delete userAsJSON.__v
    return userAsJSON

}

//Generate token and push it to tokens array propery of user
userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'thisisanodecourse')
    user.tokens.push({token})
    await user.save()
    return token
}

//Return user, if provided correct email and password
userSchema.statics.findByCredentials= async (email: String,password:String)=>{
    const user= await User.findOne({email}) //shorthand instead of email:email

    if (!user)
        throw new Error('Unable to login')

    const doesPasswordMatch=await bcrypt.compare(password,user.password)

    if (!doesPasswordMatch)
        throw new Error('Unable to login')

    return user
}

//hash password before calling save(), when creating or updating
userSchema.pre('save',async function(this:any,next:Function){ //Can't use arrow function as second argument because we need to access this

    const user=this

    if (user.isModified('password'))
        user.password= await bcrypt.hash(user.password,8)   

    next()
}) 

//Delete tasks of user on delete
userSchema.pre('remove',async function(this:any,next:Function){
    const user=this
    await Task.deleteMany({
        owner:user._id
    })
    next()
})
export const User = mongoose.model('User', userSchema)

