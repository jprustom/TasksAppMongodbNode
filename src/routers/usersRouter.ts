//IMPORTS
import { User } from "../models/userModel"
import {checkForAuthorization} from '../handlers/auth'
import { app } from "../app"
const express=require('express')
const router=express.Router()
const sharp=require('sharp')





//CREATE
router.post("/",async(req:any,res:any)=>{
 
    const user=new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user,token})
    } catch(e){
        res.status(400).send(e)
    }
    
})

//LOGIN
router.post("/login",async(req:any,res:any)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

//LOGOUT FROM CURRENT SESSION
router.post('/logout',checkForAuthorization,async(req:any,res:any)=>{
    try{
        req.user.tokens.pop(req.token)
        await req.user.save()
        res.status(200).send(`Logged out ${req.user.name}`)
    }catch(e){
        res.status(400).send(e)
    }
})

//LOGOUT FROM ALL SESSIONS
router.post('/logoutall',checkForAuthorization,async(req:any,res:any)=>{
    try{
         req.user.tokens=[]
         await req.user.save()
         res.status(200).send(`Logged out ${req.user.name} everywhere`)
    }catch(e){
        res.send(e)
    }
})
router.get('/me',checkForAuthorization,async (req:any,res:any)=>{

    res.send(req.user)

})

router.patch('/me',checkForAuthorization,async (req: any,res: any)=>{//req.body={name:'Andrea'} for eg
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if (!isValidOperation)
        return res.status(400).send('Invalid updates.')
    
    try{
        
        let user=req.user
        
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })

        await user.save()
        
        res.send(user)

    }catch(e){
        res.status(400).send()
    }
})
router.delete('/me',checkForAuthorization,async(req: any,res: any)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})
//IMAGES
const multer=require('multer')
const upload=multer({
    // dest:'avatars' REMOVE THIS LINE TO BE ABLE TO ACCESS req.file
    limits:{
        fileSize:1000000
    },
    fileFilter(req:any,file:any,cb:Function){
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/))
            return cb(new Error('Please provide png/jpg/jpeg'))
        
        return cb(undefined,true)
    }
})
//setting an avatar
router.post('/me/avatar',checkForAuthorization,upload.single('avatar'),async(req:any,res:any)=>{
   let buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.status(200).send()
},(error:any,req:any,res:any,next:Function)=>{
    res.status(400).send(error.message)
})
//deleting an avatar
router.delete('/me/avatar',checkForAuthorization,upload.single('avatar'),async(req:any,res:any)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send()
},(error:any,req:any,res:any,next:Function)=>{
    res.status(400).send(error.message)
})
//displaying an avatar
router.get('/:id/avatar',async(req:any,res:any)=>{
    try{
        const user=await User.findById(req.params.id)
        if (!user || !user.avatar)
            throw new Error()
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
module.exports=router
