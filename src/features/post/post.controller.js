import { ApplicationError } from "../../error-handler/applicationError.js";
import PostModel from "./post.model.js";
import PostRepository from "./post.repository.js";




// creating class for handling req urls and response data 
export class PostController{
    constructor(){
        this.postRepository=new PostRepository();
    }
   async addPost(req,res){
        const {caption}=req.body;
        try {
            //hash password
            console.log("the req body is");
            console.log(req.body);
           const post=new PostModel(req.userID,caption,req.file.filename);
           console.log("new user is",post);
          const newPost=await this.postRepository.addPost(post);
           res.status(201).send(newPost);
        } catch (error) {
            console.log(error); 
            throw new ApplicationError("Something went wrong with post controller",500);
          
        }
    }
    async getAllPosts(req,res){
        try {
            const posts=await this.postRepository.getAllPosts();
            if(posts){
                return res.status(200).send(posts);
            }else{
                return res.status(404).send("Posts not found");
            }
        } catch (error) {
            console.log(error); 
            throw new ApplicationError("Something went wrong in retrieving posts",500);
          
        } 
    }
    async getAll(req,res){
        try {
            const posts=await this.postRepository.getAll(req.userID);
            if(posts){
                return res.status(200).send(posts);
            }else{
                return res.status(404).send("Posts not found");
            }
        } catch (error) {
            console.log(error); 
            throw new ApplicationError("Something went wrong in retrieving posts",500);
          
        }
    }
    async getById(req,res){
        try {
            const postID=req.params.postID;
            const post=await this.postRepository.getById(postID);
            console.log("getById is calling!",post);
            if(!post){
                return res.status(404).send("Post not found");
            }else{
                return res.status(200).send(post);
            } 
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with getting post by id ",500);
        }
        
    }
    async update(req,res){
        try {
            const postID=req.params.postID;
            const caption=req.body.caption;
            let imageUrl;
            if(req.file){
                imageUrl=req.file.filename;
                   }
                   console.log(caption);
            await this.postRepository.update(postID,caption,imageUrl);
            const post=await this.postRepository.getById(postID);
            console.log("update is calling!",post);
            if(!post){
                return res.status(404).send("Post not found");
            }else{
                return res.status(200).send(post);
            } 
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with getting post by id ",500);
        }
    }
    async delete(req,res){
        try {
            const postID=req.params.postID;
            await this.postRepository.delete(postID);
            res.status(201).send("post is deleted successfully!");
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with delete post by id ",500);
        }
    }
}