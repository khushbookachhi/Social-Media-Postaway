//manage routes/paths to userController
//import express
import express from 'express';
import { FriendShipController } from './frndship.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';


//get router initialize 
const friendShipRouter=express.Router();
const friendShipController=new FriendShipController();
friendShipRouter.post("/toggle-friendship/:friendID",jwtAuth,(req,res)=>{
    friendShipController.toggleFriendShip(req,res);
})
friendShipRouter.get("/get-pending-requests",jwtAuth,(req,res)=>{
    friendShipController.getPendingReq(req,res)
});
friendShipRouter.post("/response-to-request/:friendID",jwtAuth,(req,res)=>{
    friendShipController.responseToReq(req,res)
});
friendShipRouter.get("/get-friends/:userID",jwtAuth,(req,res)=>{
    friendShipController.getFriends(req,res)
});

export default friendShipRouter;