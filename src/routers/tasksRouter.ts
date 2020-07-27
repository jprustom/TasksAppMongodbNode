const express=require('express')
const router=express.Router()
import {checkForAuthorization} from '../handlers/auth'
import {Task} from '../models/taskModel'

router.post('/',checkForAuthorization,async (req:any,res:any)=>{

    try{
        const task=new Task({
            ...req.body,
            owner:req.user._id
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
 
})
router.get('/',checkForAuthorization,async (req:any,res:any)=>{
    try{
        // let tasks:any[]=await Task.find({})
        // res.send(tasks)
               //OR
        await req.user.populate('tasks').exexPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(404).send()
    }
})

router.get('/:id',checkForAuthorization,async (req:any,res:any)=>{
    try{
        let taskId=req.params.id
        let currentUserSignedInId=req.user._id
        let task=await Task.findOne({
            _id:taskId,
            owner:currentUserSignedInId
        })
        if (!task)
            return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(404).send()
    }
})

router.patch('/:taskid',checkForAuthorization,async (req:any,res:any)=>{
    
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const doesFieldExist= updates.every((update)=>allowedUpdates.includes(update))
    if (!doesFieldExist)
        return res.status(400).send('Invalid Updates !')

    try{
        let task:any=await Task.findOne({
            _id:req.params.taskid,
            owner: req.user_id    
        })

        if (task==null)
            return res.status(404).send()

        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()

        res.status(200).send(task)

    } catch(e){
        res.status(400).send(e)
    }

})
router.delete('/:id',checkForAuthorization,async(req: any,res: any)=>{
    try{
        const task= await Task.findOneAndDelete({
            _id:req.params.id,
            owner:req.user._id
        })
        if (!task)
            return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports=router