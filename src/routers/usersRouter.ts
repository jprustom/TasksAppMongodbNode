//IMPORTS
import { User } from "../models/userModel"
import {checkForAuthorization} from '../handlers/auth'
const express=require('express')
const router=express.Router()

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

module.exports=router