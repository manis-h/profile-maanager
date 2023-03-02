import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';
const app=express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by')
const port =8080;
app.get('/',(req,res)=>{
    res.status(201).json("HOME GET REQUEST");
});
// api routes
app.use('/api',router)

//connection 
connect().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`server connected to ${port} `)
        })
        
    } catch (error) {
        console.log("CANNOT CONNECT")
    }
}).catch(error=>{
    console.log("INVALID DATABASE CONNECTION")
})
