import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import  { db } from './database/connection.js';
import router from './router/route.js';
const app=express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by')
const port =8080;
app.get('/',(req,res)=>{
    res.status(201).send("HOME GET REQUEST");
});
// api routes
app.use('/api',router)

//connection 
db()
