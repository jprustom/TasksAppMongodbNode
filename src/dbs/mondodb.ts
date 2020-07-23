import * as mongodb from 'mongodb';
const chalk=require('chalk')
const {MongoClient,ObjectID}=mongodb

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager-db'

MongoClient.connect(connectionURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},async (error,client)=>{
    if (error)
        return console.log('Unable to connect to database');
    
    console.log(chalk.green.bold('Connected To Mongodb successfully !'))
    const db=client.db(databaseName)

   
})