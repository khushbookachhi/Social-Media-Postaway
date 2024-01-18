//manage routes/paths to userController
//import express
import express from 'express';
import { UserController } from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { uploadA } from '../../middlewares/file-upload.middlware.js';
//get router initialize 
const userRouter=express.Router();
const userController=new UserController;

//all the path to controller methods
userRouter.post('/signup',uploadA.single('avatar'),(req,res)=>{
    userController.signUpController(req,res);
})
userRouter.post('/signin',(req,res,next)=>{
    userController.signInController(req,res,next);
})
userRouter.post('/signout',jwtAuth,(req,res,next)=>{
    userController.signOutController(req,res,next);
})
userRouter.get('/get-details/:userID',jwtAuth,(req,res)=>{
    userController.getById(req,res);
})
userRouter.get('/get-all-details',jwtAuth,(req,res)=>{
    userController.getAll(req,res);
})
userRouter.put('/update-details/:userID',jwtAuth,uploadA.single('avatar'),(req,res)=>{
    userController.update(req,res);
})

export default userRouter;