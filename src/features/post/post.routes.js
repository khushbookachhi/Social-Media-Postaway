//manage routes/paths to userController
//import express
import express from 'express';
import { uploadB } from '../../middlewares/file-upload.middlware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { PostController } from './post.controller.js';

//get router initialize 
const postRouter=express.Router();
const postController=new PostController;

//all the path to controller methods
postRouter.post('/',jwtAuth,uploadB.single('imageUrl'),(req,res)=>{
    postController.addPost(req,res);
})
postRouter.get('/all',jwtAuth,(req,res)=>{
    postController.getAllPosts(req,res);
})
postRouter.get('/',jwtAuth,(req,res)=>{
    postController.getAll(req,res);
})
postRouter.get('/:postID',jwtAuth,(req,res)=>{
    postController.getById(req,res);
})
postRouter.put('/:postID',jwtAuth,uploadB.single('imageUrl'),(req,res)=>{
    postController.update(req,res);
})
postRouter.delete('/:postID',jwtAuth,(req,res)=>{
    postController.delete(req,res);
})




export default postRouter;