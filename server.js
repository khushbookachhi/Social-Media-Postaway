import './env.js';
 //import express
import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import userRouter from './src/features/user/user.routes.js';
//create server
const server=express();
const port=process.env.port;
//CORS policy configuration
var corsOptions = {
    origin: `http://localhost:${port}`
  }
  server.use(cors(corsOptions));
  server.use(bodyParser.json());
//   use loggermiddleware 
server.use(loggerMiddleware);

//for all requests related to user,redirect to user routes
server.use('/api/users',userRouter);
//default request handler
server.get('/',(req,res)=>{
    res.send("welcome to Ecommerce API");
})
//Error handler Middleware
server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
       }
       
    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }else{
        //server error
        res.status(500).send('Something went wrong,please try later');
    }
})
//middleware to handle 404 requests
server.use((req,res)=>{
    res.status(404).send("API not found please check our documentation for more at localhost:4200/api-docs");

})
//specific port
server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
    connectUsingMongoose();
})