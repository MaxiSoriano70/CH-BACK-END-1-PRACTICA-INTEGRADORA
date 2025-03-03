import express from "express";
import User from "../model/user.model.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res) =>{
    try {
        const users = await User.find();
        res.status(200).send({status: "success", payload: users});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

userRouter.post("/", async (req, res) =>{
    try {
        const { name, profilePic } = req.body;
        if(!name){
            return res.status(400).send({status: "error", message: error.message});
        }
        const response = await User.insertOne({name, profilePic});
        res.status(201).send({status: "success", payload: response})
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

userRouter.put("/:uid", async (req, res) =>{
    try {
        const { uid } = req.params;
        const userUpdates = req.body;
        const response = await User.updateOne({ _id: uid}, userUpdates);
        res.status(200).send({status: "success", payload: response})
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

userRouter.delete("/:uid", async (req, res) =>{
    try {
        const { uid } = req.params;
        const response = await User.deleteOne({ _id: uid});
        res.status(200).send({status: "success", payload: response})
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

export default userRouter;