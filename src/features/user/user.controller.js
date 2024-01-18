import { ApplicationError } from "../../error-handler/applicationError.js";
import jwt from 'jsonwebtoken';
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';


// creating class for handling req urls and response data 
export class UserController{
    constructor(){
        this.userRepository=new UserRepository();
    }
    
    async signUpController(req,res,next){
        const {name,email,password,gender}=req.body;
        try {
            //hash password
            console.log(req.body);
           const hashPassword=await bcrypt.hash(password,17);
           const user=new UserModel(name,email,hashPassword,gender,req.file.filename);
           console.log("new user is",user);
          const newUser=await this.userRepository.signUp(user);
           res.status(201).send(newUser);
        } catch (error) {
            console.log(error); 
            throw new ApplicationError("Something went wrong with signup controller",500);
          
        }
       
    }
    async signInController(req,res,next){
   console.log(req.body.email,req.body.password);
     try {
        const user=await this.userRepository.findByEmail(req.body.email);
        console.log("Existing user is",user);
        if(!user){
            res.status(400).send("Incorrect credentials");
        }else{
            // compare password with hashed password 
            const result=await bcrypt.compare(req.body.password,user.password);
            console.log("result is ",result);
            if(result){
                // create token 
                const token=jwt.sign({
                    userID:user._id,
                    email:user.email,
                },
                process.env.JWT_Secret,
                {
                    expiresIn:'4h',
                }
                );
               await this.userRepository.addTokenInDb(user,token);
                return res.status(200).send(token);
            }else{
               return res.status(400).send('Incorrect Credentials');
            }
        }
     } catch (error) {
        console.log(error);
      throw new ApplicationError("Something went wrong with signIn controller ",500);
     }
    }
    async signOutController(req,res,next){
        const token=req.headers['authorization'];
        if(!token){
            return res.status(400).send("Authorization failed");
        }
        const user=await this.userRepository.findByEmail(req.body.email);
        const tokens=user.tokens; 
        const newTokens=tokens.filter(t=>{
            t.token !== token
        });
        await this.userRepository.addNewTokens(user,newTokens);
        return res.status(201).send("signed Out Successfully!!");

    }
    async getById(req,res){
        try {
            const userID=req.params.userID;
            const user=await this.userRepository.getById(userID);
            console.log("getById is calling!",user);
            if(!user){
                return res.status(404).send("User not found");
            }else{
                return res.status(200).send(user);
            } 
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with getting user by id ",500);
        }
        
    }
    async getAll(req,res){
        try {
            const users=await this.userRepository.getAll();
            if(users){
                return res.status(200).send(users);
            }else{
                return res.status(404).send("Users not found");
            }
           
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with getting all users ",500);
        }
    }
    async update(req,res){
        try {
            const userID=req.params.userID;
            const name=req.body.name;
            const gender=req.body.gender;
            let avatar;
            // console.log(req.body.avatar);
           if(req.file){
            avatar=req.file.filename;
           }else{
            avatar='Image not updated';
           }
            
         await this.userRepository.update(userID,name,gender,avatar);
         const updatedUser=await this.userRepository.getById(userID);
         res.status(200).send(updatedUser);
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with updating users ",500);  
        }
    }
   
}