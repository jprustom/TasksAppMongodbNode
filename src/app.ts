const express=require('express')
require('./dbs/mongoose')
import {taskModel as Task} from './models/task'
import {User} from './models/user'
import morgan from 'morgan';
const chalk=require('chalk')

const app = express();
app.use(morgan('dev'))
app.use(express.json());


app.get('/users',(req:any,res:any)=>{
    User.find({}).then((users:any[])=>{
        res.send(users)
    }).catch((e: any)=>{
        res.status(500).send()
    })
})
app.get('/users/:id',(req:any,res:any)=>{
    User.findById(req.params.id).then((user: any)=>{
        if (!user)
            return res.status(404).send()
        res.send(user)
    }).catch((e:any)=>{
        res.status(500).send()
    })
})

app.post('/users',(req:any,res:any)=>{
    
    const user=new User(req.body)

    user.save().then(()=>{
        res.send(user)
    }).catch((error:any)=>{res.status(400).send(error)})
})

app.post('/tasks',(req:any,res:any)=>{

    const task=new Task(req.body)
    task.save().then(()=>{
        res.send(task)
    }).catch((err:any)=>{
        res.status(400).send(err)
    })
})

module.exports=app;