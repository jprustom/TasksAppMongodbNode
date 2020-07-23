import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
import morgan from 'morgan';
const chalk=require('chalk')

dotenv.config();
const app = express();
app.use(morgan('dev'))



module.exports=app;