import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";



//creating model from schema
const PostModel=mongoose.model('Post',postSchema);
// class for doing database operations on post data 
export default class PostRepository{
    async addPost(post){
        try {
            //create instance of model
            console.log("post userId is");
            console.log(post);
            const newPost=await PostModel.create({
            userID:post.UserID,
            caption:post.caption,
            imageUrl:post.imageUrl
        });
            console.log(newPost);
            
          return  await newPost.save();
           
        } catch (error) {
            console.log(error);
                throw new ApplicationError("Something went wrong with database",500);
            
        }
    }
    async getAllPosts(){
        try {
            const posts=await PostModel.find().lean().populate("userID",'_id name email');
            console.log("these are posts",posts);
            return posts;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database ",500); 
        }
    }
    async getAll(userID){
        try {
            const posts=await PostModel.findOne({
                userID:userID
            }).lean().populate("userID",'_id name email');
            console.log("these are posts",posts);
            return posts;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database ",500); 
        }
    }
    async getById(postID){
        try {
            const post= await PostModel.findOne(
             {_id:postID});  //mongoose.Types.ObjectId
             return post;
         } catch (error) {
             console.log(error);
             throw new ApplicationError("Something went wrong with database ",500);
         }
        }
        async update(postID,caption,imageUrl){
            try {
                const post= await PostModel.findOne(
                    {_id:postID}); 
                    if(caption){
                        post.caption=caption;
                    }
                    if(imageUrl){
                        post.imageUrl=imageUrl;
                    }
                   
                    await post.save();
                   
            } catch (error) {
                console.log(error);
                    throw new ApplicationError("Something went wrong with database ",500); 
            }
            }
            async delete(postID){
                try {
                    await PostModel.findOneAndDelete(
                     {_id:postID});  //mongoose.Types.ObjectId
                    
                 } catch (error) {
                     console.log(error);
                     throw new ApplicationError("Something went wrong with database ",500);
                 }
            }
    }
