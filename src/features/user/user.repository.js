import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongoose";

//creating model from schema
const UserModel=mongoose.model('User',userSchema);

// class for doing database operations on user data 
export default class UserRepository{
    async signUp(user){
        try {
            //create instance of model
            const newUser=new UserModel(user);
            console.log(newUser);
            
          return  await newUser.save();
           
           // set avatar in new user
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw new ApplicationError("incorrect credential provide valid data",400);
            }else{
                throw new ApplicationError("Something went wrong with database",500);
            }
        }
    }
    async findByEmail(email){
        try {
            return await UserModel.findOne({email});
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database ",500);
        }
    }
   async getById(userID){
    try {
       const user= await UserModel.findOne(
        {_id:new mongoose.Types.ObjectId(userID)}).select('-tokens -_id -password -__v');  //mongoose.Types.ObjectId
        return user;
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500);
    }
   }
  async getAll(){
    try {
        const users=await UserModel.find().select('-tokens -_id -password -__v');
        console.log("these are users",users);
        return users;
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500); 
    }
  }
  async update(userID,name,gender,avatar){
try {
    const user= await UserModel.findOne(
        {_id:new mongoose.Types.ObjectId(userID)}); 
        if(name){
            user.name=name;
        }
        if(gender){
            user.gender=gender;
        }
        if(avatar){
            user.avatar=avatar;
        }
        await user.save();
       
} catch (error) {
    console.log(error);
        throw new ApplicationError("Something went wrong with database ",500); 
}
  }
   async addTokenInDb(user,token){
    let oldTokens=user.tokens|| [];
    if(oldTokens.length){
        oldTokens=oldTokens.filter(t=>{
            const timeDiffInSec=(Date.now()-parseInt(t.signedAt))/1000;
            if(timeDiffInSec<14400){
                return t;
            }
        })
    }
    await UserModel.findByIdAndUpdate(user._id,{tokens:[...oldTokens,{token,signedAt:Date.now().toString()}]})
   }
   async addNewTokens(user,newTokens){
    await UserModel.findByIdAndUpdate(user._id,{tokens:newTokens})
   }
}
