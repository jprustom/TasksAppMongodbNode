//IMPORTING MODULES
const express=require('express')
const morgan=require('morgan')
const bodyParser=require('body-parser')

//MIDDLEWARES
export const app = express();
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());

//REQUIRING ROUTERS
const usersRouter=require('./routers/usersRouter')
const tasksRouter=require('./routers/tasksRouter')

//USING ROUTERS
app.use('/users',usersRouter)
app.use('/tasks',tasksRouter)

//EXPORTING app SO WE CAN const app=require('app')
// module.exports=app;