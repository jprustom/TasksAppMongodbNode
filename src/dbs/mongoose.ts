import mongoose = require("mongoose");
const chalk=require('chalk')

const databaseName:string='task-manager-api'
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:true
})

//List All Collections:
mongoose.connection.on('open', function (ref) {
    console.log(chalk.green.bold.underline('\nConnected to mongo server, current database collections are: '));
    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
        collections.forEach(collection=>{console.log(chalk.green.bold(collection.name))})
        console.log()
        // mongoose.connection.close();
    });

})

